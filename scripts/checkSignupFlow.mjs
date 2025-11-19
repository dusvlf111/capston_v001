import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

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

const fileChecks = [
  {
    file: 'src/components/auth/SignupForm.tsx',
    snippets: ['useForm', 'supabase.auth.signUp', 'createBrowserSupabaseClient'],
  },
  {
    file: 'src/app/signup/page.tsx',
    snippets: ['SignupForm', '로그인하기'],
  },
];

function verifyFiles() {
  for (const check of fileChecks) {
    const fullPath = path.join(projectRoot, check.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`Missing file: ${check.file}`);
      process.exit(1);
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    for (const snippet of check.snippets) {
      if (!content.includes(snippet)) {
        console.error(`File ${check.file} missing snippet: ${snippet}`);
        process.exit(1);
      }
    }
  }
}

async function verifyTrigger() {
  const dbUrl = readEnvValue('DATABASE_URL');
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    const trigger = await client.query(
      `SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created' AND tgenabled = 'O'`
    );
    if (!trigger.rowCount) {
      throw new Error('Trigger on_auth_user_created not found or disabled');
    }

    const func = await client.query(
      `SELECT proname FROM pg_proc WHERE proname = 'handle_new_auth_user'`
    );
    if (!func.rowCount) {
      throw new Error('Function handle_new_auth_user not found');
    }
  } finally {
    await client.end();
  }
}

async function main() {
  verifyFiles();
  await verifyTrigger();
  console.log('Signup assets and trigger verified.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
