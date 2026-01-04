const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'tests');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('Not found:', filePath);
    return 0;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Count the number of skipped tests
  const describeSkipCount = (content.match(/describe\.skip\(/g) || []).length;
  const itSkipCount = (content.match(/it\.skip\(/g) || []).length;
  const totalSkipped = describeSkipCount + itSkipCount;

  content = content.replace(/describe\.skip\(/g, 'describe(');
  content = content.replace(/it\.skip\(/g, 'it(');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath} (${totalSkipped} skipped tests enabled)`);
    return totalSkipped;
  } else {
    console.log('No changes:', filePath);
    return 0;
  }
}

function walkDir(dir) {
  let totalFixed = 0;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      totalFixed += walkDir(filePath);
    } else if (file.endsWith('.test.ts')) {
      totalFixed += processFile(filePath);
    }
  }
  return totalFixed;
}

console.log('Fixing skipped tests in:', testDir);
console.log('');
const totalFixed = walkDir(testDir);
console.log('');
console.log(`Total skipped tests enabled: ${totalFixed}`);
console.log('Done!');
