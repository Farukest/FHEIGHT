const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('_.contains(')) {
            const newContent = content.replace(/_.contains\(/g, '_.includes(');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Fixed: ' + filePath);
            return true;
        }
    } catch (err) {
        console.error('Error processing ' + filePath + ': ' + err.message);
    }
    return false;
}

function walkDir(dir, skipDirs) {
    let fixed = 0;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!skipDirs.includes(file)) {
                fixed += walkDir(filePath, skipDirs);
            }
        } else if (file.endsWith('.js')) {
            if (replaceInFile(filePath)) fixed++;
        }
    }
    return fixed;
}

const appDir = path.join(__dirname, 'app');
const skipDirs = ['node_modules', 'vendor'];
const count = walkDir(appDir, skipDirs);
console.log('\nTotal files fixed: ' + count);
