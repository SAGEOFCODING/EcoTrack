const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('./js');
files.push('sw.js');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('"use strict"') && !content.includes("'use strict'")) {
        fs.writeFileSync(f, '"use strict";\n\n' + content);
        console.log('Added strict mode to', f);
    }
});
