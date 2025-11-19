import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

const targets = [
  {
    file: 'src/lib/supabase/client.ts',
    requiredSnippets: ['createBrowserClient', 'NEXT_PUBLIC_SUPABASE_URL', 'createBrowserSupabaseClient'],
  },
  {
    file: 'src/lib/supabase/server.ts',
    requiredSnippets: ['createServerComponentClient', 'createServerComponentSupabaseClient', 'createRouteHandlerSupabaseClient'],
  },
  {
    file: 'src/lib/supabase/middleware.ts',
    requiredSnippets: ['createMiddlewareClient', 'createSupabaseMiddlewareClient'],
  },
];

for (const target of targets) {
  const fullPath = path.join(projectRoot, target.file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing file: ${target.file}`);
    process.exit(1);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const snippet of target.requiredSnippets) {
    if (!content.includes(snippet)) {
      console.error(`File ${target.file} is missing snippet: ${snippet}`);
      process.exit(1);
    }
  }
}

console.log('Supabase client helper files are present and include required exports.');
