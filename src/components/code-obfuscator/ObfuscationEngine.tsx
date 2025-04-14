
import React from 'react';

// JavaScript obfuscation
export const obfuscateJavaScript = (sourceCode: string, options: any) => {
  if (!sourceCode) return '';
  
  const { renameVariables, stringEncoding, deadCodeInjection, controlFlowFlattening, obfuscationLevel } = options;
  
  let result = sourceCode;
  
  if (renameVariables) {
    const varRegex = /\b(let|var|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const funcRegex = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    
    const varNames = new Map();
    
    result = result.replace(varRegex, (match, keyword, varName) => {
      if (!varNames.has(varName)) {
        varNames.set(varName, `_${Math.random().toString(36).substr(2, 9)}`);
      }
      return `${keyword} ${varNames.get(varName)}`;
    });
    
    result = result.replace(funcRegex, (match, funcName) => {
      if (!varNames.has(funcName)) {
        varNames.set(funcName, `_${Math.random().toString(36).substr(2, 9)}`);
      }
      return `function ${varNames.get(funcName)}`;
    });
    
    varNames.forEach((newName, oldName) => {
      const regex = new RegExp(`\\b${oldName}\\b(?!\\s*=|\\s*:)`, 'g');
      result = result.replace(regex, newName);
    });
  }
  
  if (stringEncoding) {
    result = result.replace(/"([^"]*)"/g, (match, str) => {
      if (typeof str === 'string') {
        const charCodes = Array.from(str).map((c) => c.charCodeAt(0));
        return `String.fromCharCode(${charCodes.join(',')})`;
      }
      return match;
    });
    
    result = result.replace(/'([^']*)'/g, (match, str) => {
      if (typeof str === 'string') {
        const charCodes = Array.from(str).map((c) => c.charCodeAt(0));
        return `String.fromCharCode(${charCodes.join(',')})`;
      }
      return match;
    });
  }
  
  if (deadCodeInjection) {
    const deadFuncs = [
      "\nfunction _unused1() { console.log('This is never called'); return Math.random() > 0.5; }\n",
      "\nfunction _unused2() { if (false) { console.log('Unreachable'); } return null; }\n",
      "\nvar _dummy = function() { return Date.now() % 2 === 0 ? 'even' : 'odd'; };\n"
    ];
    
    for (let i = 0; i < 3; i++) {
      const randomDeadCode = deadFuncs[Math.floor(Math.random() * deadFuncs.length)];
      const position = Math.floor(Math.random() * result.length);
      result = result.substring(0, position) + randomDeadCode + result.substring(position);
    }
  }
  
  if (controlFlowFlattening && obfuscationLevel === 'high') {
    result = `
(function() {
  var _state = 0;
  var _result;
  
  while (true) {
    switch (_state) {
      case 0:
        _state = 1;
        break;
      case 1:
        ${result}
        _state = 2;
        break;
      case 2:
        return _result;
        break;
      default:
        return;
    }
  }
})();`;
  }
  
  return result;
};

// Python obfuscation 
export const obfuscatePython = (sourceCode: string, options: any) => {
  if (!sourceCode) return '';
  
  const { renameVariables, stringEncoding, deadCodeInjection } = options;
  
  let result = sourceCode;
  
  if (renameVariables) {
    const varRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    const funcRegex = /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    
    const varNames = new Map();
    
    result = result.replace(varRegex, (match, varName) => {
      if (varName !== 'self' && !varName.startsWith('__')) {
        if (!varNames.has(varName)) {
          varNames.set(varName, `_${Math.random().toString(36).substr(2, 9)}`);
        }
        return `${varNames.get(varName)} =`;
      }
      return match;
    });
    
    result = result.replace(funcRegex, (match, funcName) => {
      if (!funcName.startsWith('__')) {
        if (!varNames.has(funcName)) {
          varNames.set(funcName, `_${Math.random().toString(36).substr(2, 9)}`);
        }
        return `def ${varNames.get(funcName)}(`;
      }
      return match;
    });
    
    varNames.forEach((newName, oldName) => {
      const regex = new RegExp(`\\b${oldName}\\b(?!(\\s*=|\\s*\\())`, 'g');
      result = result.replace(regex, newName);
    });
  }
  
  if (stringEncoding) {
    result = result.replace(/(['\"]).+?\1/g, (match) => {
      // Remove the quotes
      const str = match.slice(1, -1);
      if (typeof str === 'string') {
        const chars = Array.from(str).map((c) => `chr(${c.charCodeAt(0)})`);
        return `"".join([${chars.join(', ')}])`;
      }
      return match;
    });
  }
  
  if (deadCodeInjection) {
    const deadCode = [
      "\ndef _unused():\n    if False:\n        print('Never executed')\n    return None\n",
      "\nif 1 == 2:\n    print('This is impossible')\n",
      "\n_never_called = lambda x: x * 2\n"
    ];
    
    for (let i = 0; i < 3; i++) {
      const randomDeadCode = deadCode[Math.floor(Math.random() * deadCode.length)];
      const lines = result.split('\n');
      const position = Math.floor(Math.random() * lines.length);
      lines.splice(position, 0, randomDeadCode);
      result = lines.join('\n');
    }
  }
  
  return result;
};

// CSS obfuscation
export const obfuscateCSS = (sourceCode: string, options: any) => {
  if (!sourceCode) return '';
  
  const { renameVariables } = options;
  
  let result = sourceCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  result = result.replace(/\s+/g, ' ');
  
  if (renameVariables) {
    const selectorRegex = /([.#][a-zA-Z_-][a-zA-Z0-9_-]*)/g;
    const nameMap = new Map();
    
    result = result.replace(selectorRegex, (match, selector) => {
      const prefix = selector.charAt(0);
      const name = selector.slice(1);
      
      if (!nameMap.has(name)) {
        nameMap.set(name, `${prefix}_${nameMap.size}`);
      }
      
      return nameMap.get(name);
    });
  }
  
  result = result.replace(/;\s*}/g, '}');
  result = result.replace(/\s*{\s*/g, '{');
  result = result.replace(/\s*}\s*/g, '}');
  result = result.replace(/\s*:\s*/g, ':');
  result = result.replace(/\s*;\s*/g, ';');
  result = result.replace(/\s*,\s*/g, ',');
  
  return result;
};

// HTML obfuscation
export const obfuscateHTML = (sourceCode: string, options: any) => {
  if (!sourceCode) return '';
  
  const { renameVariables } = options;
  
  let result = sourceCode;
  
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  
  result = result.replace(/>\s+</g, '><');
  
  if (renameVariables) {
    const idRegex = /id=["']([^"']+)["']/g;
    const classRegex = /class=["']([^"']+)["']/g;
    
    const idMap = new Map();
    const classMap = new Map();
    
    result = result.replace(idRegex, (match, id) => {
      if (!idMap.has(id)) {
        idMap.set(id, `id_${idMap.size}`);
      }
      return `id="${idMap.get(id)}"`;
    });
    
    result = result.replace(classRegex, (match, classes) => {
      const classList = classes.split(/\s+/);
      const obfuscatedClasses = classList.map(cls => {
        if (!classMap.has(cls)) {
          classMap.set(cls, `c_${classMap.size}`);
        }
        return classMap.get(cls);
      });
      return `class="${obfuscatedClasses.join(' ')}"`;
    });
  }
  
  return result;
};

// Main obfuscation function that calls the appropriate language-specific function
export const obfuscateCode = (code: string, language: string, options: any) => {
  switch (language) {
    case 'javascript':
      return obfuscateJavaScript(code, options);
    case 'python':
      return obfuscatePython(code, options);
    case 'css':
      return obfuscateCSS(code, options);
    case 'html':
      return obfuscateHTML(code, options);
    default:
      return code;
  }
};
