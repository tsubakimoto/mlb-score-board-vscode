export class MLBApiService {
    constructor() {
        this.baseUrl = 'https://statsapi.mlb.com/api/v1';
    }

    async getTodaysGames() {
        const todayPST = this.getTodayInPST();
        const url = `${this.baseUrl}/schedule/games/?sportId=1&date=${todayPST}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.dates[0]?.games || [];
        } catch (error) {
            throw new Error(`Failed to fetch MLB data: ${error.message}`);
        }
    }

    getTodayInPST() {
        const now = new Date();
        const pstTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        
        const month = String(pstTime.getMonth() + 1).padStart(2, '0');
        const day = String(pstTime.getDate()).padStart(2, '0');
        const year = pstTime.getFullYear();
        
        return `${month}/${day}/${year}`;
    }
}