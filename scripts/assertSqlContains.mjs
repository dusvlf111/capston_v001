import fs from 'node:fs';
import path from 'node:path';

const [,, fileArg, ...needles] = process.argv;
if (!fileArg || !needles.length) {
  console.error('Usage: node scripts/assertSqlContains.mjs <sql-file> <needle> [needle...]');
  process.exit(1);
}

const sqlPath = path.resolve(process.cwd(), fileArg);
if (!fs.existsSync(sqlPath)) {
  console.error(`SQL file not found: ${sqlPath}`);
  process.exit(1);
}

const content = fs.readFileSync(sqlPath, 'utf8');
let ok = true;
for (const needle of needles) {
  if (!content.includes(needle)) {
    console.error(`Pattern not found: ${needle}`);
    ok = false;
  } else {
    console.log(`PASS: found pattern "${needle}"`);
  }
}

if (!ok) {
  process.exit(1);
}
