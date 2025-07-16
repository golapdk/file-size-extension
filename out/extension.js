"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
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
function deactivate() { }
function formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}
//# sourceMappingURL=extension.js.map