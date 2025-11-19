import { Client } from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPECTED = {
  profiles: ['profiles_select_own', 'profiles_insert_self', 'profiles_update_own'],
  reports: ['reports_select_own', 'reports_insert_self', 'reports_update_own'],
  safety_zones: ['safety_zones_select_public'],
};

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
  const client = new Client({ connectionString: loadEnvValue('DATABASE_URL') });
  await client.connect();
  try {
    for (const [table, policies] of Object.entries(EXPECTED)) {
      const { rows } = await client.query(
        `SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = $1`,
        [table]
      );
      const existing = new Set(rows.map((row) => row.policyname));
      let ok = true;
      for (const policy of policies) {
        if (!existing.has(policy)) {
          console.error(`Missing policy ${policy} on ${table}`);
          ok = false;
        } else {
          console.log(`PASS: policy ${policy} exists on ${table}`);
        }
      }
      if (!ok) {
        process.exitCode = 1;
      }
    }
  } finally {
    await client.end();
  }
}

main();
