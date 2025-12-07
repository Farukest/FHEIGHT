const fs = require('fs');
const path = require('path');

// Get all files with DS002 warning
const { execSync } = require('child_process');
const files = execSync('grep -rln "DS002: Fix invalid constructor" app/ --include="*.js"')
  .toString()
  .trim()
  .split('\n')
  .filter(f => f.length > 0);

console.log(`Found ${files.length} files to fix`);

let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Pattern: constructor followed by opening brace, where super() is NOT the first statement
  // We need to handle various patterns:
  // 1. constructor(args) { \n    this.something
  // 2. constructor(args) { if (x == null) { ... } \n this.something
  
  // Find class that extends something
  const extendsMatch = content.match(/class\s+\w+\s+extends\s+\w+/);
  if (!extendsMatch) {
    console.log(`  Skipping ${file} - no extends clause found`);
    return;
  }
  
  // Check if super() is already present
  if (content.includes('super(') || content.includes('super()')) {
    console.log(`  Skipping ${file} - already has super()`);
    return;
  }
  
  // Find constructor and add super() after the opening brace
  const constructorPattern = /(constructor\s*\([^)]*\)\s*\{)/g;
  const newContent = content.replace(constructorPattern, '$1\n    super();');
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log(`  Fixed: ${file}`);
    fixed++;
  } else {
    console.log(`  No change: ${file}`);
  }
});

console.log(`\nFixed ${fixed} files`);
