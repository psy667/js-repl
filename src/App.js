import React, {useState} from 'react';
import './App.css';
import MonacoEditor from 'react-monaco-editor';
import {terminalService} from "./services/preprocessor";
import {ConsoleComponent} from "./components/console/Console";

function App() {
    const [defaultValue, setDefaultValue] = useState('');
    function handleEditorDidMount(editor, monaco) {
        setDefaultValue(terminalService.getCode());
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
        terminalService.setCode(value);
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
