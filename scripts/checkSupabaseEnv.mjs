import fs from 'node:fs';
import path from 'node:path';

const modes = {
  url: {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    validate: (value) => /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value),
    description: 'Supabase project URL should match https://<ref>.supabase.co'
  },
  anon: {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    validate: (value) => typeof value === 'string' && value.length > 20 && !value.includes('REPLACE_WITH'),
    description: 'Anon key must be populated with a real Supabase anon token'
  },
  database: {
    key: 'DATABASE_URL',
    validate: (value) => /^postgresql:\/\/[\w%]+:[^@]+@db\.[a-z0-9]+\.supabase\.co:\d+\/.+$/i.test(value),
    description: 'Database URL should include credentials and db.<ref>.supabase.co host'
  }
};

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function main() {
  const mode = process.argv[2];
  if (!mode || !modes[mode]) {
    console.error('Usage: node scripts/checkSupabaseEnv.mjs <mode>');
    console.error('Modes:', Object.keys(modes).join(', '));
    process.exit(1);
  }

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error(`.env.local not found at ${envPath}`);
    process.exit(1);
  }

  const env = parseEnvFile(envPath);
  const { key, validate, description } = modes[mode];
  const value = env[key];

  if (typeof value === 'undefined') {
    console.error(`Missing ${key} in .env.local`);
    process.exit(1);
  }

  if (!validate(value)) {
    console.error(`Validation failed for ${key}: ${description}`);
    process.exit(1);
  }

  console.log(`PASS: ${key} validated for mode "${mode}"`);
}

main();
