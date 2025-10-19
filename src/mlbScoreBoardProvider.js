import * as vscode from 'vscode';
import { MLBApiService } from './mlbApiService.js';

class GameItem extends vscode.TreeItem {
    constructor(game, apiService) {
        const awayTeam = apiService.getTeamAbbreviation(game.teams.away.team.name);
        const homeTeam = apiService.getTeamAbbreviation(game.teams.home.team.name);
        const awayScore = game.teams.away.score || 0;
        const homeScore = game.teams.home.score || 0;
        const status = game.status.detailedState;
        const venueName = game.venue?.name || '';
        
        const label = `${awayTeam} ${awayScore} - ${homeScore} ${homeTeam} @${venueName}`;
        
        super(label, vscode.TreeItemCollapsibleState.None);
        
        this.description = status;
        this.contextValue = 'game';
        this.tooltip = `${game.teams.away.team.name} vs ${game.teams.home.team.name} - ${status}`;
    }
}

export class MLBScoreBoardProvider {
    constructor() {
        this.apiService = new MLBApiService();
        this.games = [];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            // Return root level items (games)
            return this.games.map(game => new GameItem(game, this.apiService));
        }
        return [];
    }

    async refresh() {
        try {
            this.games = await this.apiService.getTodaysGames();
            this._onDidChangeTreeData.fire();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load MLB scores: ${error.message}`);
            this.games = [];
            this._onDidChangeTreeData.fire();
        }
    }
}