import React, {useEffect, useState} from 'react';
import {terminalService} from "../../services/preprocessor";
import './Console.css';

const consoleJSHeader = (showLogger) => {
    const logger = `
    const logger = (r) => {
        const element = document.createElement('p');

        element.innerHTML = '> ' + r;

        document.getElementById('logger').appendChild(element);
    }
    console.log = (r) => logger(r);
    console.info = (r) => logger(r);
    console.error = (r) => logger(r);

`
    return showLogger ? logger : ``;
}

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
    
    ::-webkit-scrollbar {
        width: 14px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgb(30,30,30);
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgb(66,66,66);
    }
    
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(80, 80, 80);
    }

`;

export const ConsoleComponent = (props) => {
    const showLogger = !props.hide;
    const [iframe, setIframe] = useState({__html: ''});

    const createIframe = (code, showLogger) => {
        const iframeSrc = 'data:text/html;charset=utf-8,' + encodeURI(`
            <head>
                <title>What?</title>
                <style type="text/css">${consoleCSS}</style>
            </head>
            <body>
                ${consoleHTML}
                <script type="text/javascript">
                    ${consoleJSHeader(showLogger)}${code}
                </script>
            </body>
        `);
        const iframe = {
            __html: `<iframe class="iframe" src="${iframeSrc}"></iframe>`
        };
        setIframe(() => iframe);
    }

    useEffect(() => {
        terminalService.compiledCode.subscribe(r => {
            createIframe(r, showLogger);
        })
    }, [showLogger])

    return (
        <div className="logger-wrapper"
             style={{display: showLogger ? 'block' : 'none'}}
             dangerouslySetInnerHTML={iframe}
        />
    );
}
