import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const middlewarePath = path.join(projectRoot, 'middleware.ts');

if (!fs.existsSync(middlewarePath)) {
  console.error('middleware.ts not found');
  process.exit(1);
}

const content = fs.readFileSync(middlewarePath, 'utf8');
const requiredSnippets = [
  'export async function middleware',
  'createSupabaseMiddlewareClient',
  'supabase.auth.getSession',
  'PROTECTED_PREFIXES',
  'export const config',
];

for (const snippet of requiredSnippets) {
  if (!content.includes(snippet)) {
    console.error(`middleware.ts missing snippet: ${snippet}`);
    process.exit(1);
  }
}

console.log('middleware.ts includes required auth/session handling logic.');
