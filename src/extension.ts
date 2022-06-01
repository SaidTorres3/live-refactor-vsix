// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
// import libraries to read file
import * as fs from "fs";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "rename-preview" is now active!'
  );
	const orange = vscode.window.createOutputChannel("orange");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "rename-preview.liveRefactor",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from rename-preview!");
      // get the text of the current editor
      let editor = vscode.window.activeTextEditor;

      // create a pane for the preview
      let panel = vscode.window.createWebviewPanel(
        "preview", // Identifies the type of the webview. Used internally
        "Preview", // Title of the panel displayed to the user
        vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
        {
          enableScripts: true, // Allow javascript in the webview,
					enableForms: true,
					
        }
      );

      // set ./preview.html as the webview's html content
      const previewFile = path.join(context.extensionPath, "src", "preview.html");
      let preview = fs.readFileSync(previewFile, "utf8");
      preview = preview.replace("${text}", editor?.document?.getText()||"");
      
      panel.webview.html = preview;

      // update the text of the preview when the document changes
			vscode.workspace.onDidChangeTextDocument(
				(e: vscode.TextDocumentChangeEvent) => {
					// replace the text of eto with the new text
					orange.appendLine(e.document.getText());
					panel.webview.postMessage({
							txt: e.document.getText()
						});
					}
			);

    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
