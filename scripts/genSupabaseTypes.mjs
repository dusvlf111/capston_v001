import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = path.resolve(process.cwd());
const envPath = path.join(projectRoot, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}

function readEnvValue(key) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    if (k === key) {
      let value = line.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      return value;
    }
  }
  throw new Error(`${key} not found in .env.local`);
}

const dbUrl = readEnvValue('DATABASE_URL');
const args = ['supabase', 'gen', 'types', 'typescript', '--db-url', dbUrl];
const result = spawnSync('npx', args, {
  cwd: projectRoot,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});

if (result.status !== 0) {
  console.error('Failed to generate types');
  process.exit(result.status ?? 1);
}

const typesDir = path.join(projectRoot, 'src', 'types');
fs.mkdirSync(typesDir, { recursive: true });
const outputPath = path.join(typesDir, 'database.types.ts');
fs.writeFileSync(outputPath, result.stdout, 'utf8');
console.log(`Generated types at ${path.relative(projectRoot, outputPath)}`);
