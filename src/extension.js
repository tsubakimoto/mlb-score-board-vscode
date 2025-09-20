import * as vscode from 'vscode';
import { MLBScoreBoardProvider } from './mlbScoreBoardProvider.js';

export function activate(context) {
    const provider = new MLBScoreBoardProvider();
    
    // Register the tree data provider
    const treeView = vscode.window.createTreeView('mlbScoreBoard', {
        treeDataProvider: provider,
        showCollapseAll: false
    });
    
    // Register the refresh command
    const refreshCommand = vscode.commands.registerCommand('mlbScoreBoard.refresh', () => {
        provider.refresh();
    });

    context.subscriptions.push(treeView, refreshCommand);
    
    // Initial load of scores
    provider.refresh();
}

export function deactivate() {}