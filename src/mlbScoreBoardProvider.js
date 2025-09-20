import * as vscode from 'vscode';
import { MLBApiService } from './mlbApiService.js';

export class MLBScoreBoardProvider {
    constructor() {
        this.apiService = new MLBApiService();
        this.panel = undefined;
    }

    async showScores() {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'mlbScoreBoard',
            'MLB Score Board',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });

        this.panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'reload') {
                await this.loadScores();
            }
        });

        await this.loadScores();
    }

    async loadScores() {
        try {
            const games = await this.apiService.getTodaysGames();
            const html = this.generateHtml(games);
            this.panel.webview.html = html;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load MLB scores: ${error.message}`);
            const errorHtml = this.generateErrorHtml(error.message);
            this.panel.webview.html = errorHtml;
        }
    }

    generateHtml(games) {
        const gamesList = games.map(game => {
            const awayTeam = this.getTeamAbbreviation(game.teams.away.team.name);
            const homeTeam = this.getTeamAbbreviation(game.teams.home.team.name);
            const awayScore = game.teams.away.score || 0;
            const homeScore = game.teams.home.score || 0;
            const status = game.status.detailedState;
            
            return `
                <div class="game-item">
                    <span class="score-line">${awayTeam} ${awayScore} - ${homeScore} ${homeTeam}</span>
                    <span class="status">${status}</span>
                </div>
            `;
        }).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>MLB Score Board</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        font-size: var(--vscode-font-size);
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                        padding: 20px;
                        margin: 0;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 10px;
                    }
                    h1 {
                        margin: 0;
                        color: var(--vscode-foreground);
                    }
                    .reload-btn {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 16px;
                        cursor: pointer;
                        border-radius: 4px;
                        font-size: 14px;
                    }
                    .reload-btn:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    .game-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px;
                        margin-bottom: 8px;
                        background-color: var(--vscode-list-inactiveSelectionBackground);
                        border-radius: 4px;
                        border-left: 3px solid var(--vscode-focusBorder);
                    }
                    .score-line {
                        font-weight: bold;
                        font-family: monospace;
                        font-size: 16px;
                    }
                    .status {
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                        text-transform: uppercase;
                    }
                    .no-games {
                        text-align: center;
                        color: var(--vscode-descriptionForeground);
                        font-style: italic;
                        padding: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>MLB Scores - Today</h1>
                    <button class="reload-btn" onclick="reloadScores()">Reload</button>
                </div>
                <div class="games-container">
                    ${games.length > 0 ? gamesList : '<div class="no-games">No games scheduled for today</div>'}
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function reloadScores() {
                        vscode.postMessage({ command: 'reload' });
                    }
                </script>
            </body>
            </html>
        `;
    }

    generateErrorHtml(errorMessage) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>MLB Score Board - Error</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                        padding: 20px;
                        margin: 0;
                    }
                    .error {
                        color: var(--vscode-errorForeground);
                        text-align: center;
                        padding: 40px;
                    }
                    .reload-btn {
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 16px;
                        cursor: pointer;
                        border-radius: 4px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="error">
                    <h2>Error loading MLB scores</h2>
                    <p>${errorMessage}</p>
                    <button class="reload-btn" onclick="reloadScores()">Try Again</button>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function reloadScores() {
                        vscode.postMessage({ command: 'reload' });
                    }
                </script>
            </body>
            </html>
        `;
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