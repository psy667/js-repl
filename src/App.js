import React, {useRef, useState} from 'react';
import './App.css';
import Editor from '@monaco-editor/react';
import {KeyCode, KeyMod} from 'monaco-editor';
import {terminalService} from "./services/preprocessor";
import {ConsoleComponent} from "./components/console/Console";

function App() {
    const [_, setIsEditorReady] = useState(false);
    const valueGetter = useRef();
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

    function handleEditorDidMount(_valueGetter, editor) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
        editor.addAction({
            id: 'submit',
            label: 'Submit',
            keybindings: [
                KeyMod.CtrlCmd | KeyCode.Enter,
            ],
            run() {
                executeCode()
            }
        })
    }

    function executeCode() {
        terminalService.executeCode(valueGetter.current());
    }

    return (
        <div className="App">
            <header className="App-header">
                <div>JS-REPL</div>
                <button className="button-run" onClick={executeCode}>RUN<span>(ctrl+Enter)</span></button>
                <div>GitHub</div>
            </header>
            <main>
                <div className="input">
                    <Editor
                        language="javascript"
                        value={defaultValue}
                        height="96vh"
                        theme="dark"
                        editorDidMount={handleEditorDidMount}
                    />
                </div>
                <div className="output">
                    <ConsoleComponent />
                </div>
            </main>
        </div>
    );
}

export default App;
