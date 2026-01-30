# Live Refactor

A powerful VS Code extension for live text refactoring with variable substitution. Preview your changes in real-time as you define variables and their replacement values.

![Live Refactor Showcase](https://raw.githubusercontent.com/SaidTorres3/live-refactor-vsix/refs/heads/master/docs/images/v1.0.0/v1.0.0.png)

## Features

- 🔄 **Real-time Preview**: See your text transformations instantly as you type
- 📝 **Multiple Variables**: Define unlimited variable substitutions
- 🎯 **Case Sensitivity**: Toggle case-sensitive matching per variable
- 📋 **One-Click Copy**: Copy the refactored result to clipboard with a single click
- 💾 **State Persistence**: Your variables and settings persist even when moving tabs
- 🎨 **Clean Modern UI**: Beautiful interface that integrates seamlessly with VS Code themes
- ⚡ **Vanilla JavaScript**: Lightweight implementation with zero dependencies

## Usage

1. Open any text file in VS Code
2. Run the command **"Live Refactor"** from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. A preview panel will open showing your current file content
4. Define variables and their replacement values:
   - Enter the variable name you want to find
   - Enter the value you want to replace it with
   - Optionally enable "Case Sensitive" for exact case matching
5. See the live preview update automatically
6. Click **Copy** to copy the refactored text to your clipboard
7. Add or remove variables as needed using the **Add Variable** and **✕** buttons

## Example

**Original Text:**
```
Hello USER_NAME, welcome to PRODUCT_NAME!
Your account user_name has been created.
```

**Variable Definitions:**
- Variable: `USER_NAME` → Value: `John Doe` (Case Sensitive: ✓)
- Variable: `user_name` → Value: `john.doe` (Case Sensitive: ✓)
- Variable: `PRODUCT_NAME` → Value: `Amazing App`

**Result:**
```
Hello John Doe, welcome to Amazing App!
Your account john.doe has been created.
```

## Commands

| Command | Description |
|---------|-------------|
| `Live Refactor` | Opens the live refactor preview panel |

## Installation

### From Source
1. Clone this repository
2. Run `npm install` (optional, no dependencies required for runtime)
3. Press `F5` to open a new VS Code window with the extension loaded
4. Open any file and run the "Live Refactor" command

### From VSIX
1. Package the extension: `vsce package`
2. Install the `.vsix` file: `code --install-extension rename-preview-*.vsix`

## Requirements

- VS Code version 1.67.0 or higher

## Known Issues

None at the moment. Please report any issues on the [GitHub repository](https://github.com/SaidTorres3/live-refactor-vsix/issues).

## Release Notes

### 1.0.0

Initial release of Live Refactor:
- Real-time variable substitution preview
- Multiple variable support
- Case-sensitive toggle per variable
- Copy to clipboard functionality
- State persistence across tab movements
- Modern, theme-aware UI
- Vanilla JavaScript implementation (no React, no build step required)

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests on the [GitHub repository](https://github.com/SaidTorres3/live-refactor-vsix).

## License

See LICENSE file for details.

---

**Enjoy refactoring with Live Refactor!** 🚀

