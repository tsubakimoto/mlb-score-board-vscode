import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MLBScoreBoardProvider } from '../src/mlbScoreBoardProvider.js';

vi.mock('vscode', () => ({
    window: {
        createWebviewPanel: vi.fn(() => ({
            reveal: vi.fn(),
            onDidDispose: vi.fn(),
            webview: {
                onDidReceiveMessage: vi.fn(),
                html: ''
            }
        })),
        showErrorMessage: vi.fn()
    },
    ViewColumn: {
        One: 1
    }
}));

describe('MLBScoreBoardProvider', () => {
    let provider;
    let mockApiService;

    beforeEach(() => {
        provider = new MLBScoreBoardProvider();
        mockApiService = {
            getTodaysGames: vi.fn()
        };
        provider.apiService = mockApiService;
    });

    describe('getTeamAbbreviation', () => {
        it('should return correct abbreviations for known teams', () => {
            expect(provider.getTeamAbbreviation('New York Yankees')).toBe('NYY');
            expect(provider.getTeamAbbreviation('Boston Red Sox')).toBe('BOS');
            expect(provider.getTeamAbbreviation('Chicago Cubs')).toBe('CHC');
            expect(provider.getTeamAbbreviation('Athletics')).toBe('OAK');
        });

        it('should return first 3 characters for unknown teams', () => {
            expect(provider.getTeamAbbreviation('Unknown Team')).toBe('UNK');
            expect(provider.getTeamAbbreviation('Test')).toBe('TES');
        });
    });

    describe('generateHtml', () => {
        it('should generate HTML with game scores', () => {
            const games = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: 10 },
                        home: { team: { name: 'Boston Red Sox' }, score: 5 }
                    },
                    status: { detailedState: 'Final' }
                }
            ];

            const html = provider.generateHtml(games);

            expect(html).toContain('NYY 10 - 5 BOS');
            expect(html).toContain('Final');
            expect(html).toContain('MLB Scores - Today');
        });

        it('should handle games with no scores', () => {
            const games = [
                {
                    teams: {
                        away: { team: { name: 'New York Yankees' }, score: undefined },
                        home: { team: { name: 'Boston Red Sox' }, score: undefined }
                    },
                    status: { detailedState: 'Scheduled' }
                }
            ];

            const html = provider.generateHtml(games);

            expect(html).toContain('NYY 0 - 0 BOS');
            expect(html).toContain('Scheduled');
        });

        it('should show no games message when empty', () => {
            const html = provider.generateHtml([]);

            expect(html).toContain('No games scheduled for today');
        });
    });

    describe('generateErrorHtml', () => {
        it('should generate error HTML with message', () => {
            const errorMessage = 'Network connection failed';
            const html = provider.generateErrorHtml(errorMessage);

            expect(html).toContain('Error loading MLB scores');
            expect(html).toContain('Network connection failed');
            expect(html).toContain('Try Again');
        });
    });
});