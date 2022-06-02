

import * as vscode from "vscode";

import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  
  console.log(
    'Congratulations, your extension "rename-preview" is now active!'
  );
  
  let disposable = vscode.commands.registerCommand(
    "rename-preview.liveRefactor",
    () => {
      let editor = vscode.window.activeTextEditor;

      let panel = vscode.window.createWebviewPanel(
        "preview",
        "Preview",
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          enableForms: true,
          enableCommandUris: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "src/libs/react")),
          ],
        }
      );

      const scriptPathOnDisk1 = vscode.Uri.file(path.join(context.extensionPath, "src/libs/react/babel.min.js"));
      const scriptPathOnDisk2 = vscode.Uri.file(path.join(context.extensionPath, "src/libs/react/react.production.min.js"));
      const scriptPathOnDisk3 = vscode.Uri.file(path.join(context.extensionPath, "src/libs/react/react-dom.production.min.js"));

      const scriptUri1 = panel.webview.asWebviewUri(scriptPathOnDisk1);
      const scriptUri2 = panel.webview.asWebviewUri(scriptPathOnDisk2);
      const scriptUri3 = panel.webview.asWebviewUri(scriptPathOnDisk3);

      const nonce = getNonce();
        
      const previewFile = path.join(
        context.extensionPath,
        "src",
        "preview.html"
      );
      let preview = fs.readFileSync(previewFile, "utf8");
      preview = preview.replace(
        /\${scriptUri1}/g,
        scriptUri1.toString()
      );
      preview = preview.replace(
        /\${scriptUri2}/g,
        scriptUri2.toString()
      );
      preview = preview.replace(
        /\${scriptUri3}/g,
        scriptUri3.toString()
      );
      preview = preview.replace(
        /\${nonce}/g,
        nonce
      );

      panel.webview.html = preview;

      const setText = (text: string) => {
        panel.webview.postMessage({
          txt: text,
        });
      };

      setText(editor?.document?.getText() || "");

      vscode.workspace.onDidChangeTextDocument(
        (e: vscode.TextDocumentChangeEvent) => {
          setText(e.document.getText());
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function deactivate() {}
