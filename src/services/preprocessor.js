import {BehaviorSubject} from "rxjs";

const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
}

const removeFromStr = (str, arr) => {
    return arr.reduce((acc, cur) => {
        return replaceAll(acc, cur, "")
    }, str)
}

class Preprocessor{
    currentCode = "";

    constructor() {
        this.compiledCode = new BehaviorSubject(null);
    }


    executeCode(code){
        const processedCode = this.process(code);
        this.compiledCode.next(processedCode);
    }

    replaceImports = (line) => {
        const [importPartRaw, libPartRaw] = line.split('from');

        const importedFunctions = removeFromStr(importPartRaw, [' ', '{', '}', 'import']).split(',');
        const libPart = removeFromStr(libPartRaw, [';', "'", '"', " "]);

        return importedFunctions.map(it => {
            const key = it;
            const value = [...libPart.split('/'), it].join('.');
            return `const ${key} = ${value}`;
        }).join(`
  `);
    }

    process = () => {
        const code = this.currentCode;
        const buildId = (Math.abs(Math.random()*2e9>>0)).toString(36);
        const metaDataArray = [`// build: ${buildId}`, `// timestamp: ${new Date().getTime()}`];
        const resultArray = code.split('\n').map(line => {
            if (line.indexOf('import') === 0) {
                return this.replaceImports(line)
            }
            return replaceAll(line, 'console.log', 'console.log');
        });
        return [...metaDataArray, ...resultArray].join('\n');
    }
}

export const terminalService = new Preprocessor();
