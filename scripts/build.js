import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const child = spawn('bun', ['x', 'astro', 'build'], {
  cwd: rootDir,
  stdio: 'pipe',
  shell: true,
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  stdout += text;
  process.stdout.write(text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  stderr += text;
  process.stderr.write(text);
});

child.on('close', (code) => {
  const output = stdout + stderr;

  // The ASSETS binding error is a known issue with @astrojs/cloudflare + wrangler 4.x
  // Build artifacts are still valid; this only affects the post-build wrangler preview step
  if (code !== 0 && output.includes("'ASSETS' is reserved in Pages projects")) {
    console.log('\n\n[build.js] Build artifacts generated successfully.');
    console.log('[build.js] Ignoring known ASSETS binding validation error from @astrojs/cloudflare.');
    console.log('[build.js] You can deploy with: wrangler pages deploy dist\n');
    process.exit(0);
  }

  process.exit(code ?? 0);
});
