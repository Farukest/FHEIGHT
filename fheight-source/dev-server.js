const { spawn, exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const FIREBASE_URL = 'https://zama-e9173-default-rtdb.firebaseio.com/';

console.log('🚀 Starting FHEIGHT Dev Server...\n');

// Track if build is running
let cssBuilding = false;
let jsBuilding = false;

// Run gulp task
function runGulp(task, callback) {
  const env = { ...process.env, FIREBASE_URL };
  const cmd = `npx gulp ${task}`;

  console.log(`⚡ Running: ${cmd}`);
  const start = Date.now();

  exec(cmd, { env }, (error, stdout, stderr) => {
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    if (error) {
      console.error(`❌ ${task} failed (${duration}s)`);
    } else {
      console.log(`✅ ${task} done (${duration}s)`);
    }
    callback && callback(error);
  });
}

// Watch SCSS files
console.log('👀 Watching SCSS files...');
const scssWatcher = chokidar.watch('app/ui/styles/**/*.scss', {
  ignoreInitial: true,
});

scssWatcher.on('change', (filePath) => {
  if (cssBuilding) return;
  cssBuilding = true;
  console.log(`\n📝 SCSS changed: ${path.basename(filePath)}`);
  runGulp('css', () => { cssBuilding = false; });
});

// Watch template files
console.log('👀 Watching template files...');
const templateWatcher = chokidar.watch('app/ui/templates/**/*.hbs', {
  ignoreInitial: true,
});

templateWatcher.on('change', (filePath) => {
  if (jsBuilding) return;
  jsBuilding = true;
  console.log(`\n📝 Template changed: ${path.basename(filePath)}`);
  runGulp('js', () => { jsBuilding = false; });
});

// Watch JS/Coffee files
console.log('👀 Watching JS/Coffee files...');
const jsWatcher = chokidar.watch(['app/**/*.js', 'app/**/*.coffee'], {
  ignoreInitial: true,
  ignored: /node_modules/,
});

jsWatcher.on('change', (filePath) => {
  if (jsBuilding) return;
  jsBuilding = true;
  console.log(`\n📝 JS changed: ${path.basename(filePath)}`);
  runGulp('js', () => { jsBuilding = false; });
});

// Start Vite dev server
console.log('\n🌐 Starting Vite dev server...');
const vite = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
});

vite.on('error', (err) => {
  console.error('Vite error:', err);
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  scssWatcher.close();
  templateWatcher.close();
  jsWatcher.close();
  vite.kill();
  process.exit();
});

console.log('\n✨ Dev server ready! Changes will auto-rebuild.\n');
console.log('📌 Tips:');
console.log('   - SCSS changes: ~1 second');
console.log('   - Template/JS changes: ~45 seconds');
console.log('   - Browser auto-refreshes on file changes\n');
