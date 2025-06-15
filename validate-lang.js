const fs = require('fs');
const path = require('path');

const addon = JSON.parse(fs.readFileSync('addon.json', 'utf8'));
const translations = addon.translations || {};

let ok = true;
for (const [tag, filePath] of Object.entries(translations)) {
    const jsonPath = path.join(__dirname, filePath);
    if (!fs.existsSync(jsonPath)) {
        console.error(`Translation file missing: ${filePath}`);
        ok = false;
        continue;
    }
    try {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (data.lang !== tag) {
            console.error(`Language mismatch in ${filePath}: expected '${tag}', got '${data.lang}'`);
            ok = false;
        }
    } catch (err) {
        console.error(`Failed to parse ${filePath}: ${err}`);
        ok = false;
    }
}
if (!ok) {
    process.exit(1);
}
console.log('All translation files validated');
