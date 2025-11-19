import { Client } from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvValue(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local not found');
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
  const tables = process.argv.slice(2);
  if (!tables.length) {
    console.error('Usage: node scripts/checkSchema.mjs <table> [table...]');
    process.exit(1);
  }

  const client = new Client({ connectionString: loadEnvValue('DATABASE_URL') });
  await client.connect();

  try {
    for (const tableName of tables) {
      const { rows } = await client.query(
        `SELECT to_regclass($1) IS NOT NULL AS exists`,
        [`public.${tableName}`]
      );
      if (!rows[0].exists) {
        console.error(`Missing table: ${tableName}`);
        process.exitCode = 1;
      } else {
        console.log(`PASS: table ${tableName} exists`);
      }
    }
  } finally {
    await client.end();
  }
}

main();
