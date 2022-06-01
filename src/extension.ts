

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

      const thehtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          // allow scritps to be loaded from ./libs/react
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${panel.webview.cspSource} https:; script-src ${panel.webview.cspSource}; style-src ${panel.webview.cspSource};" />
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Preview</title>
          <script nonce="${nonce}" src="${scriptUri1}" crossorigin></script>
          <script nonce="${nonce}" src="${scriptUri2}"></script>
          <script nonce="${nonce}" src="${scriptUri3}" crossorigin></script>
          <style>
            .variables {
              border: 1px solid red;
              padding: 10px;
              margin-bottom: 5px;
            }

            .inputs-container {
              margin: 10px 0;
            }

            .remove-button {
              margin-left: 10px;
              border: 1px solid red;
              padding: 5px;
              cursor: pointer;
            }

            .text {
              border: 1px solid blue;
              padding: 10px;
            }

            p {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div id="app"></div>

          <script type="text/babel">
            const container = document.getElementById("app");
            const root = ReactDOM.createRoot(container);

            function Hello() {
              const [text, setText] = React.useState("");
              const [originalText, setOriginalText] = React.useState("");
              const [variables, setVariables] = React.useState([
                {
                  name: "",
                  value: "",
                },
              ]);

              window.addEventListener("message", (event) => {
                const txt = event.data.txt;
                setOriginalText(txt);
                setText(txt);
              });

              const updateVariablesValues = (e, index) => {
                setVariables((prev) => {
                  console.log(e.target.value);
                  let previous = [...prev];
                  if (e.target.name === "variable") {
                    previous[index].name = e.target.value;
                  } else {
                    previous[index].value = e.target.value;
                  }
                  return previous;
                });
              };

              React.useEffect(() => {
                replaceVariablesToValues();
              }, [variables]);

              const replaceVariablesToValues = () => {
                let o_text = originalText;
                variables.forEach((variable) => {
                  o_text = o_text.replace(
                    new RegExp(variable.name, "g"),
                    variable.value||""
                  );
                });
                setText(o_text);
              };

              const addVariable = () => {
                setVariables((prev) => [
                  ...prev,
                  {
                    name: "",
                    value: "",
                  },
                ]);
              };

              const removeVariable = (index) => {
                setVariables((prev) => {
                  let previous = [...prev];
                  previous.splice(index, 1);
                  return previous;
                });
              };

              return (
                <div>
                  <div className="header">
                    <div className="variables">
                      {variables.map((item, index) => (
                        <div key={index} className="inputs-container">
                          <span className="variable">Variable: </span>
                          <input
                            type="text"
                            name="variable"
                            value={item.name}
                            onChange={(e) => {
                              updateVariablesValues(e, index);
                            }}
                          />
                          <span className="value"> Value: </span>
                          <input
                            type="text"
                            name="value"
                            value={item.value}
                            onChange={(e) => {
                              updateVariablesValues(e, index);
                            }}
                          />
                          <button
                            onClick={() => {
                              removeVariable(index);
                            }}
                            className="remove-button"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addVariable()}>Add</button>
                    </div>
                  </div>

                  <div className="text">
                    <p id="text">{text}</p>
                  </div>
                </div>
              );
            }

            root.render(<Hello />);
          </script>
        </body>
      </html>
      `;

      panel.webview.html = thehtml;

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
