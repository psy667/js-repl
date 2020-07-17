import React, {useState} from 'react';
import './App.css';
import MonacoEditor from 'react-monaco-editor';
import {terminalService} from "./services/preprocessor";
import {ConsoleComponent} from "./components/console/Console";

function App() {
    const defaultValue = `
const fib = (n) => {
  let prev1 = 0n;
  let prev2 = 1n;
  for(let i = 0; i < n; i++){
    const curVal = prev1 + prev2;
    prev1 = prev2;
    prev2 = curVal;
  }
  return prev2;
}

console.log(fib(40));
    `;

    function handleEditorDidMount(editor, monaco) {
        terminalService.currentCode = defaultValue;
        editor.focus();

        editor.addAction({
            id: 'submit',
            label: 'javascript',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
            ],
            run() {
                executeCode()
            }
        })
    }

    function handleOnChange(value) {
        terminalService.currentCode = value;
    }

    function executeCode() {
        terminalService.executeCode();
    }

    const [nativeConsole, setNativeConsole] = useState(false);

    return (
        <div className="App">
            <header className="App-header">
                <div>JS-REPL</div>
                <button className="button-run" onClick={executeCode}>RUN<span>(ctrl+Enter)</span></button>
                <div>GitHub</div>
                <div className="toggle-wrapper">
                    Native console
                    <div onClick={() => setNativeConsole(!nativeConsole)}
                        className={['toggle', nativeConsole ? 'active' : ''].join(' ')}><span/></div>
                </div>
            </header>
            <main>
                <div className="input">
                    <MonacoEditor
                        height="96vh"
                        width={ nativeConsole ? "100vw" : "50vw"}
                        language="javascript"
                        value={defaultValue}
                        theme="vs-dark"
                        editorDidMount={handleEditorDidMount}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="output">
                    <ConsoleComponent hide={nativeConsole} />
                </div>
            </main>
        </div>
    );
}

export default App;
