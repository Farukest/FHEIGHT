const fs = require('fs');
const { execSync } = require('child_process');

// Get all files with DS002 warning
const files = execSync('grep -rln "DS002: Fix invalid constructor" app/ --include="*.js"')
  .toString()
  .trim()
  .split('\n')
  .filter(f => f.length > 0);

console.log(`Found ${files.length} files to fix`);

let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Pattern: code before super() that uses 'this'
  // Match: constructor(args) { ... <code using this> ... super(args); }
  // Fix: Move super() to immediately after constructor opening brace
  
  // Find pattern where this.something appears before super()
  // We need to find constructor, then find 'this.' before 'super('
  
  const constructorPattern = /constructor\s*\([^)]*\)\s*\{([^}]*?)super\s*\(/;
  const match = content.match(constructorPattern);
  
  if (match) {
    const beforeSuper = match[1];
    // Check if 'this.' appears before super
    if (beforeSuper.includes('this.')) {
      // Find the super call with arguments
      const superPattern = /(constructor\s*\([^)]*\)\s*\{)([^}]*?)(super\s*\([^)]*\);?)/;
      const superMatch = content.match(superPattern);
      
      if (superMatch) {
        const constructorDecl = superMatch[1];
        const codeBeforeSuper = superMatch[2].trim();
        const superCall = superMatch[3];
        
        // Move super() to first, then the code
        const newConstructor = `${constructorDecl}\n    ${superCall}\n    ${codeBeforeSuper}`;
        const newContent = content.replace(superPattern, newConstructor);
        
        if (newContent !== content) {
          fs.writeFileSync(file, newContent);
          console.log(`Fixed: ${file}`);
          fixed++;
        }
      }
    }
  }
});

console.log(`\nFixed ${fixed} files`);
