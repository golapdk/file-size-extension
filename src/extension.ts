import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);

    const updateFileSize = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            statusBarItem.hide();
            return;
        }

        const filePath = editor.document.uri.fsPath;
        if (!fs.existsSync(filePath)) {
            statusBarItem.hide();
            return;
        }

        fs.stat(filePath, (err, stats) => {
            if (err) {
                statusBarItem.hide();
                return;
            }
            const size = formatBytes(stats.size);
            statusBarItem.text = `$(file) ${size}`;
            statusBarItem.tooltip = `File size: ${size}`;
            statusBarItem.show();
        });
    };

    vscode.window.onDidChangeActiveTextEditor(updateFileSize, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(updateFileSize, null, context.subscriptions);

    updateFileSize();
}

export function deactivate() {}

function formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}
