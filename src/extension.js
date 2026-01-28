const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  console.log(
    'Congratulations, your extension "rename-preview" is now active!'
  );
  
  let disposable = vscode.commands.registerCommand(
    "rename-preview.liveRefactor",
    () => {
      let editor = vscode.window.activeTextEditor;

      let panel = vscode.window.createWebviewPanel(
        "preview",
        "Live Refactor Preview",
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          enableForms: true,
          enableCommandUris: true,
        }
      );
        
      const previewFile = path.join(
        context.extensionPath,
        "src",
        "preview.html"
      );
      let preview = fs.readFileSync(previewFile, "utf8");

      panel.webview.html = preview;

      const setText = (text) => {
        panel.webview.postMessage({
          txt: text,
        });
      };

      setText(editor?.document?.getText() || "");

      vscode.workspace.onDidChangeTextDocument((e) => {
        setText(e.document.getText());
      });
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
