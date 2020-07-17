import React, {useEffect, useState} from 'react';
import {terminalService} from "../../services/preprocessor";
import './Console.css';

const consoleJSHeader = () => `
    const logger = (r) => {
        const element = document.createElement('p');

        element.innerHTML = '> ' + r;

        document.getElementById('logger').appendChild(element);
    }
    console.log = (r) => logger(r);
    console.info = (r) => logger(r);
    console.error = (r) => logger(r);

`

const consoleHTML = `
    <div id="logger"></div>

`

const consoleCSS = `
    .date {
        color: gray;
    }
    p {
        border-bottom: 1px solid rgb(54, 54, 54);
        padding: 8px 8px;
        margin: 0;
        max-width: 100%;
        overflow-wrap: break-word;
    }
    
    body {
        color: rgb(187, 196, 206);
        font-family: monospace;
    }

`;

export const ConsoleComponent = () => {
    const [iframe, setIframe] = useState({__html: ''});
    const createIframe = (code) => {
        const iframeSrc = 'data:text/html;charset=utf-8,' + encodeURI(`
            <head><title>What?</title><style type="text/css">${consoleCSS}</style></head><body>${consoleHTML}<script type="text/javascript">${consoleJSHeader()}${code}</script></body>
        `);
        const iframe = {
            __html: `<iframe class="iframe" src="${iframeSrc}"></iframe>`
        };
        setIframe(() => iframe);
    }

    useEffect(() => {
        terminalService.compiledCode.subscribe(r => {
            createIframe(r);
        })
    }, [])

    return (
        <div className="logger-wrapper"
             dangerouslySetInnerHTML={iframe}
        />
    );
}
