import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvValue(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local not found and environment variable missing');
  }
  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [k, ...rest] = line.split('=');
    if (k.trim() === key) {
      const value = rest.join('=').trim();
      return value.replace(/^['"]|['"]$/g, '');
    }
  }
  throw new Error(`${key} not found in .env.local`);
}

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('Usage: node scripts/runSql.mjs <path-to-sql>');
    process.exit(1);
  }

  const sqlPath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found: ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const connectionString = loadEnvValue('DATABASE_URL');

  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log(`Executed SQL from ${fileArg}`);
  } catch (error) {
    console.error('Failed to execute SQL:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
