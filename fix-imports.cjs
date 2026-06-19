const fs = require('fs');
const path = require('path');

const SRC_DIR = './src';

function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fixImports(fullPath);
    }
  });
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /from\s+['"](\.\.?\/[^'"]+)['"]/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js') &&
          !importPath.endsWith('.jsx')) {
        return `from '${importPath}'`;
      }
      return match;
    }
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

walk(SRC_DIR);

console.log('Done fixing imports.');