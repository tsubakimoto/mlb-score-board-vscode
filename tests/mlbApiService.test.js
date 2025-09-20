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
});