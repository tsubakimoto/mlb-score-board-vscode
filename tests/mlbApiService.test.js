import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MLBApiService } from '../src/mlbApiService.js';

describe('MLBApiService', () => {
    let service;

    beforeEach(() => {
        service = new MLBApiService();
        global.fetch = vi.fn();
    });

    describe('getTodayInPST', () => {
        it('should return date in MM/DD/YYYY format', () => {
            vi.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('12/25/2025, 3:00:00 PM');
            
            const result = service.getTodayInPST();
            
            expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
        });

        it('should handle single digit dates with padding', () => {
            const mockDate = new Date('2025-01-05T15:00:00');
            vi.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('1/5/2025, 3:00:00 PM');
            
            const result = service.getTodayInPST();
            
            expect(result).toBe('01/05/2025');
        });
    });

    describe('getTodaysGames', () => {
        it('should fetch games for today', async () => {
            const mockResponse = {
                dates: [{
                    games: [
                        {
                            teams: {
                                away: { team: { name: 'New York Yankees' }, score: 5 },
                                home: { team: { name: 'Boston Red Sox' }, score: 3 }
                            },
                            status: { detailedState: 'Final' }
                        }
                    ]
                }]
            };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await service.getTodaysGames();

            expect(result).toHaveLength(1);
            expect(result[0].teams.away.team.name).toBe('New York Yankees');
            expect(result[0].teams.home.team.name).toBe('Boston Red Sox');
        });

        it('should fetch games for a specific date when provided', async () => {
            const mockResponse = {
                dates: [{
                    games: [
                        {
                            teams: {
                                away: { team: { name: 'New York Yankees' }, score: 2 },
                                home: { team: { name: 'Boston Red Sox' }, score: 1 }
                            },
                            status: { detailedState: 'Final' }
                        }
                    ]
                }]
            };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await service.getTodaysGames('12/25/2024');

            expect(result).toHaveLength(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('date=12/25/2024')
            );
        });

        it('should return empty array when no games', async () => {
            const mockResponse = { dates: [] };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await service.getTodaysGames();

            expect(result).toEqual([]);
        });

        it('should handle fetch errors', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(service.getTodaysGames()).rejects.toThrow('Failed to fetch MLB data: Network error');
        });

        it('should handle HTTP errors', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(service.getTodaysGames()).rejects.toThrow('Failed to fetch MLB data: HTTP error! status: 404');
        });
    });

    describe('getTeamAbbreviation', () => {
        it('should return correct abbreviations for known teams', () => {
            expect(service.getTeamAbbreviation('New York Yankees')).toBe('NYY');
            expect(service.getTeamAbbreviation('Boston Red Sox')).toBe('BOS');
            expect(service.getTeamAbbreviation('Chicago Cubs')).toBe('CHC');
            expect(service.getTeamAbbreviation('Athletics')).toBe('OAK');
        });

        it('should return first 3 characters for unknown teams', () => {
            expect(service.getTeamAbbreviation('Unknown Team')).toBe('UNK');
            expect(service.getTeamAbbreviation('Test')).toBe('TES');
        });
    });
});