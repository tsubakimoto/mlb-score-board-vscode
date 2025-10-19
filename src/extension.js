import * as vscode from 'vscode';
import { MLBScoreBoardProvider } from './mlbScoreBoardProvider.js';

export function activate(context) {
    const provider = new MLBScoreBoardProvider();
    
    // Register the tree data provider
    const treeView = vscode.window.createTreeView('mlbScoreBoard', {
        treeDataProvider: provider,
        showCollapseAll: false
    });
    
    // Pass the tree view to the provider so it can update the title
    provider.setTreeView(treeView);
    
    // Register the refresh command
    const refreshCommand = vscode.commands.registerCommand('mlbScoreBoard.refresh', () => {
        provider.refresh();
    });

    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('mlbScoreBoard.gameDate')) {
            provider.refresh();
        }
    });

    context.subscriptions.push(treeView, refreshCommand, configChangeListener);
    
    // Initial load of scores
    provider.refresh();
}

export function deactivate() {}