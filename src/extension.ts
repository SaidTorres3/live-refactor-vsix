// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

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
    "rename-preview.helloWorld",
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

      // add button to the webview
      panel.webview.html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
  </head>
  <style>
    header {
      border: 1px solid red;
      padding: 10px;
    }

    .inputs-container {
      margin: 10px 0;
    }

    .text {
      border: 1px solid blue;
      padding: 10px;
    }
  </style>
  <body>
    <script>
      const addVariable = () => {
        const variablesElement = document.getElementById("variables");

        const inputsContainer= document.createElement("div");
        inputsContainer.classList.add("inputs-container");

        const variableSpan = document.createElement("span");
        variableSpan.innerHTML = "Variable: ";
        inputsContainer.appendChild(variableSpan);

        const variableInput = document.createElement("input");
        variableInput.type = "text";
        variableInput.name = "variable";
        variableInput.classList.add("variableInput");
        inputsContainer.appendChild(variableInput);

        const valueSpan = document.createElement("span");
        valueSpan.innerHTML = " Value: ";
        inputsContainer.appendChild(valueSpan);

        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.name = "value";
        valueInput.classList.add("valueInput");
        inputsContainer.appendChild(valueInput);

        variablesElement.appendChild(inputsContainer);
      };
    </script>
    <header class="header">
      <div id="variables" class="variables">
        <div class="inputs-container">
          <span class="variable">Variable:</span>
          <input type="text" class="variableInput" />
          <span class="value">Value:</span>
          <input type="text" class="valueInput"/>
        </div>
      </div>
      <button onclick="addVariable()">Add</button>
    </header>

    <div class="text">
      <p id="text">${editor?.document.getText()}</p>
    </div>
    <script>
      let originalTxt = document.getElementById("text").innerHTML;
      window.addEventListener("message", (event) => {
        const txt = event.data.txt;
        originalTxt = txt;
        document.getElementById("text").innerHTML = txt;
				replaceVariables();
      });

      const replaceVariables = () => {
        const variables = document.getElementsByClassName("variableInput");
        const values = document.getElementsByClassName("valueInput");

        const textElement = document.getElementById("text");
        let text = originalTxt

        for (let i = 0; i < variables.length; i++) {
          const variable = variables[i].value;
          const value = values[i].value;

          text = text.replace(variable, value);
          console.log(text);
        }

        textElement.innerHTML = text;
      };

      window.addEventListener("input", () => {
        console.log('trig')
        replaceVariables();
      });
    </script>
  </body>
</html>

					`;

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
