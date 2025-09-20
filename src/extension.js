import * as vscode from 'vscode';
import { MLBScoreBoardProvider } from './mlbScoreBoardProvider.js';

export function activate(context) {
    const provider = new MLBScoreBoardProvider();
    
    const disposable = vscode.commands.registerCommand('mlbScoreBoard.showScores', () => {
        provider.showScores();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}