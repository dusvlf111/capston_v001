import fs from 'node:fs';
import path from 'node:path';

const targetDir = path.resolve(process.cwd(), 'src', 'lib', 'supabase');

if (!fs.existsSync(targetDir)) {
  console.error(`Directory missing: ${targetDir}`);
  process.exit(1);
}

const entries = fs.readdirSync(targetDir);
console.log(`PASS: Found src/lib/supabase (entries: ${entries.length})`);
