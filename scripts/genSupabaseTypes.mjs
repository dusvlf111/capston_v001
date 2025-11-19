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

const typeMapping = new Map([
  ['uuid', 'string'],
  ['text', 'string'],
  ['varchar', 'string'],
  ['bpchar', 'string'],
  ['bool', 'boolean'],
  ['boolean', 'boolean'],
  ['int2', 'number'],
  ['int4', 'number'],
  ['int8', 'number'],
  ['float4', 'number'],
  ['float8', 'number'],
  ['numeric', 'number'],
  ['decimal', 'number'],
  ['json', 'Json'],
  ['jsonb', 'Json'],
  ['date', 'string'],
  ['time', 'string'],
  ['timetz', 'string'],
  ['timestamp', 'string'],
  ['timestamptz', 'string'],
]);

function resolveTsType(column) {
  const baseType = (column.udt_name || column.data_type || '').toLowerCase();
  if (typeMapping.has(baseType)) {
    return typeMapping.get(baseType);
  }
  if (column.data_type === 'ARRAY') {
    const element = baseType.replace(/^_/, '');
    const elementType = typeMapping.get(element) || 'unknown';
    return `${elementType}[]`;
  }
  return 'unknown';
}

function isNullable(column) {
  return column.is_nullable === 'YES';
}

function isOptional(column) {
  return isNullable(column) || column.column_default !== null;
}

function renderColumns(columns, mode) {
  return columns
    .map((column) => {
      const tsType = resolveTsType(column);
      const nullable = isNullable(column);
      const base = nullable ? `${tsType} | null` : tsType;
      if (mode === 'row') {
        return `          ${column.column_name}: ${base};`;
      }
      if (mode === 'insert') {
        const optional = isOptional(column);
        return `          ${column.column_name}${optional ? '?' : ''}: ${base};`;
      }
      return `          ${column.column_name}?: ${base};`;
    })
    .join('\n');
}

function renderTable(tableName, columns) {
  return `      ${tableName}: {
        Row: {
${renderColumns(columns, 'row')}
        };
        Insert: {
${renderColumns(columns, 'insert')}
        };
        Update: {
${renderColumns(columns, 'update')}
        };
        Relationships: [];
      };`;
}

async function fetchTables(client) {
  const { rows } = await client.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`
  );
  return rows.map((row) => row.table_name);
}

async function fetchColumns(client, tableName) {
  const { rows } = await client.query(
    `SELECT column_name, data_type, udt_name, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [tableName]
  );
  return rows;
}

function buildFileContent(tables) {
  const tableBlocks = Object.entries(tables)
    .map(([name, columns]) => renderTable(name, columns))
    .join('\n\n');

  return `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
${tableBlocks}
    };
    Views: never;
    Functions: never;
    Enums: never;
    CompositeTypes: never;
  };
};
`;
}

async function main() {
  const dbUrl = readEnvValue('DATABASE_URL');
  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    const tableNames = await fetchTables(client);
    if (!tableNames.length) {
      throw new Error('No public tables found');
    }

    const tables = {};
    for (const name of tableNames) {
      tables[name] = await fetchColumns(client, name);
    }

    const content = buildFileContent(tables);
    const typesDir = path.join(projectRoot, 'src', 'types');
    fs.mkdirSync(typesDir, { recursive: true });
    const outputPath = path.join(typesDir, 'database.types.ts');
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Generated types at ${path.relative(projectRoot, outputPath)}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
