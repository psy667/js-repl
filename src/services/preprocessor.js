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
    constructor() {
        this.compiledCode = new BehaviorSubject(null);
    }


    executeCode(code){
        const processedCode = this.process(code);
        console.log(processedCode);
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

    process = (code) => {
        return code.split('\n').map(line => {
            if (line.indexOf('import') === 0) {
                return this.replaceImports(line)
            }
            return replaceAll(line, 'console.log', 'console.log');
        }).join(`
  `);
    }
}

export const terminalService = new Preprocessor();
