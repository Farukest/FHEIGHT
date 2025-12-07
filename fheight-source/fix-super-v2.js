const fs = require('fs');
const { execSync } = require('child_process');

// Get all files with DS002 warning
const files = execSync('grep -rln "DS002: Fix invalid constructor" app/ --include="*.js"')
  .toString()
  .trim()
  .split('\n')
  .filter(f => f.length > 0);

console.log(`Found ${files.length} files to fix\n`);

let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Pattern: if (this.something) { ... } before super()
  // Replace with: super(args); if (this.something) { ... }
  
  // Match the pattern:
  // constructor(args) {
  //     if (this.type == null) { this.type = ClassName.type; }
  //     super(args);
  // }
  
  const pattern = /(constructor\s*\([^)]*\)\s*\{\s*\n?\s*)(if\s*\(this\.[^}]+\})\s*\n?\s*(super\s*\([^)]*\);)/gm;
  
  content = content.replace(pattern, (match, p1, p2, p3) => {
    return `${p1}${p3}\n    ${p2}`;
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
    fixed++;
  }
});

console.log(`\nFixed ${fixed} files`);
