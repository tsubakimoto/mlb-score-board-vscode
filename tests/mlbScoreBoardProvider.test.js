import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MLBScoreBoardProvider } from '../src/mlbScoreBoardProvider.js';

// Mock vscode module with TreeItem and EventEmitter
vi.mock('vscode', () => ({
    TreeItem: class TreeItem {
        constructor(label, collapsibleState) {
            this.label = label;
            this.collapsibleState = collapsibleState;
        }
    },
    TreeItemCollapsibleState: {
        None: 0,
        Collapsed: 1,
        Expanded: 2
    },
    EventEmitter: class EventEmitter {
        constructor() {
            this.event = vi.fn();
        }
        fire() {
            // Mock fire method
        }
    },
    window: {
        showErrorMessage: vi.fn()
    },
    workspace: {
        getConfiguration: vi.fn(() => ({
            get: vi.fn(() => '')
        }))
    }
}));

describe('MLBScoreBoardProvider', () => {
    let provider;
    let mockApiService;

    beforeEach(() => {
        provider = new MLBScoreBoardProvider();
        mockApiService = {
            getTodaysGames: vi.fn(),
            getTeamAbbreviation: vi.fn((teamName) => {
                const abbreviations = {
                    'New York Yankees': 'NYY',
                    'Boston Red Sox': 'BOS',
                    'Chicago Cubs': 'CHC',
                    'Athletics': 'OAK'
                };
                return abbreviations[teamName] || teamName.substring(0, 3).toUpperCase();
            })
        };
        provider.apiService = mockApiService;
    });

    describe('getTreeItem', () => {
        it('should return the tree item as-is', () => {
            const mockItem = { label: 'Test Item' };
            const result = provider.getTreeItem(mockItem);
            expect(result).toBe(mockItem);
        });
    });

    describe('getChildren', () => {
        it('should return game items for root element', () => {
            const mockGames = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: 10 },
                        home: { team: { name: 'Boston Red Sox' }, score: 5 }
                    },
                    status: { detailedState: 'Final' },
                    venue: { name: 'Fenway Park' }
                }
            ];
            provider.games = mockGames;

            const children = provider.getChildren();

            expect(children).toHaveLength(1);
            expect(children[0].label).toBe('NYY 10 - 5 BOS');
            expect(children[0].description).toBe('Final @Fenway Park');
        });

        it('should return empty array for non-root elements', () => {
            const children = provider.getChildren({ label: 'Some Game' });
            expect(children).toEqual([]);
        });

        it('should handle games with no scores', () => {
            const mockGames = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: undefined },
                        home: { team: { name: 'Boston Red Sox' }, score: undefined }
                    },
                    status: { detailedState: 'Scheduled' },
                    venue: { name: 'Fenway Park' }
                }
            ];
            provider.games = mockGames;

            const children = provider.getChildren();

            expect(children).toHaveLength(1);
            expect(children[0].label).toBe('NYY 0 - 0 BOS');
            expect(children[0].description).toBe('Scheduled @Fenway Park');
        });

        it('should handle games without venue information', () => {
            const mockGames = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: 3 },
                        home: { team: { name: 'Boston Red Sox' }, score: 2 }
                    },
                    status: { detailedState: 'Final' }
                }
            ];
            provider.games = mockGames;

            const children = provider.getChildren();

            expect(children).toHaveLength(1);
            expect(children[0].label).toBe('NYY 3 - 2 BOS');
            expect(children[0].description).toBe('Final');
        });
    });

    describe('refresh', () => {
        it('should load games and fire tree data change event', async () => {
            const mockGames = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: 10 },
                        home: { team: { name: 'Boston Red Sox' }, score: 5 }
                    },
                    status: { detailedState: 'Final' },
                    venue: { name: 'Fenway Park' }
                }
            ];

            mockApiService.getTodaysGames.mockResolvedValue(mockGames);
            const fireSpy = vi.spyOn(provider._onDidChangeTreeData, 'fire');

            await provider.refresh();

            expect(mockApiService.getTodaysGames).toHaveBeenCalled();
            expect(provider.games).toEqual(mockGames);
            expect(fireSpy).toHaveBeenCalled();
        });

        it('should pass custom date from configuration to API service', async () => {
            const mockGames = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: 3 },
                        home: { team: { name: 'Boston Red Sox' }, score: 2 }
                    },
                    status: { detailedState: 'Final' },
                    venue: { name: 'Fenway Park' }
                }
            ];

            // Mock configuration to return a specific date
            const vscode = await import('vscode');
            vscode.workspace.getConfiguration = vi.fn(() => ({
                get: vi.fn(() => '12/25/2024')
            }));

            mockApiService.getTodaysGames.mockResolvedValue(mockGames);

            await provider.refresh();

            expect(mockApiService.getTodaysGames).toHaveBeenCalledWith('12/25/2024');
            expect(provider.games).toEqual(mockGames);
        });

        it('should pass undefined when no custom date is configured', async () => {
            const mockGames = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: 4 },
                        home: { team: { name: 'Boston Red Sox' }, score: 1 }
                    },
                    status: { detailedState: 'Final' },
                    venue: { name: 'Fenway Park' }
                }
            ];

            // Mock configuration to return empty string
            const vscode = await import('vscode');
            vscode.workspace.getConfiguration = vi.fn(() => ({
                get: vi.fn(() => '')
            }));

            mockApiService.getTodaysGames.mockResolvedValue(mockGames);

            await provider.refresh();

            expect(mockApiService.getTodaysGames).toHaveBeenCalledWith(undefined);
            expect(provider.games).toEqual(mockGames);
        });

        it('should handle API errors gracefully', async () => {
            const errorMessage = 'Network error';
            mockApiService.getTodaysGames.mockRejectedValue(new Error(errorMessage));
            const fireSpy = vi.spyOn(provider._onDidChangeTreeData, 'fire');

            await provider.refresh();

            expect(provider.games).toEqual([]);
            expect(fireSpy).toHaveBeenCalled();
        });
    });
});