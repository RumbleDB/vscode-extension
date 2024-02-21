// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { Trace } from 'vscode-jsonrpc';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

const main: string = 'StdioLauncher';
let client: LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "jsoniqlanguageserver" is now active!');

    // Get the java gome from process environment
    const { JAVA_HOME } = process.env;

    console.log(`Using java from JAVA_HOME: ${JAVA_HOME}`);

    // If java home is available continue.
    if (JAVA_HOME) {
        // Java execution path.
        let excecutable: string = JAVA_HOME;

        // path to the launcher.jar
        let classPath = path.join(__dirname, '..', 'launcher', 'launcher.jar');
        console.log(`Using launcher.jar from: ${classPath}`);
        // const args: string[] = ['-cp', classPath];
        const args: string[] = ['-jar', classPath];

        // Set the server options 
        // -- java execution path
        // -- argument to be pass when executing the java command
        let serverOptions: ServerOptions = {
            command: excecutable,
            // args: [...args, main],
            args: [...args],
            options: {}
        };

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            // Register the server for plain text documents
            documentSelector: [{ scheme: 'file', language: 'jsoniq' }],
            synchronize: {
                fileEvents: vscode.workspace.createFileSystemWatcher('**/*.jq')
            }
        };

        // Create the language client and start the client.
        client = new LanguageClient('jsoniqlanguageserver', 'JSONiq Language Server', serverOptions, clientOptions);

        client.setTrace(Trace.Verbose);

        client.start().then((value) => {
            console.log(`Promise Resolved, ${value}`);
        }).catch((value) => {
            console.log(`Promise Rejected, ${value}`);
        });
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('Your extension "jsoniqlanguageserver" is now deactivated!');
    if (!client) {
        return undefined;
    }
    return client.stop();
}
