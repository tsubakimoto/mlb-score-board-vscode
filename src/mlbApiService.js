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

    getTeamAbbreviation(teamName) {
        const teamAbbreviations = {
            'Arizona Diamondbacks': 'ARI',
            'Atlanta Braves': 'ATL',
            'Baltimore Orioles': 'BAL',
            'Boston Red Sox': 'BOS',
            'Chicago Cubs': 'CHC',
            'Chicago White Sox': 'CWS',
            'Cincinnati Reds': 'CIN',
            'Cleveland Guardians': 'CLE',
            'Colorado Rockies': 'COL',
            'Detroit Tigers': 'DET',
            'Houston Astros': 'HOU',
            'Kansas City Royals': 'KC',
            'Los Angeles Angels': 'LAA',
            'Los Angeles Dodgers': 'LAD',
            'Miami Marlins': 'MIA',
            'Milwaukee Brewers': 'MIL',
            'Minnesota Twins': 'MIN',
            'New York Mets': 'NYM',
            'New York Yankees': 'NYY',
            'Oakland Athletics': 'OAK',
            'Athletics': 'OAK',
            'Philadelphia Phillies': 'PHI',
            'Pittsburgh Pirates': 'PIT',
            'San Diego Padres': 'SD',
            'San Francisco Giants': 'SF',
            'Seattle Mariners': 'SEA',
            'St. Louis Cardinals': 'STL',
            'Tampa Bay Rays': 'TB',
            'Texas Rangers': 'TEX',
            'Toronto Blue Jays': 'TOR',
            'Washington Nationals': 'WSH'
        };
        
        return teamAbbreviations[teamName] || teamName.substring(0, 3).toUpperCase();
    }
}