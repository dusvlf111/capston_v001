import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const targetPath = path.join(projectRoot, 'src', 'types', 'database.types.ts');
if (!fs.existsSync(targetPath)) {
  console.error('Supabase types file does not exist at src/types/database.types.ts');
  process.exit(1);
}

const content = fs.readFileSync(targetPath, 'utf8');
const requirements = {
  profiles: ['user_id', 'full_name', 'phone', 'emergency_contact'],
  reports: ['report_no', 'location_data', 'status', 'safety_score'],
  safety_zones: ['zone_name', 'zone_type', 'boundary', 'restrictions'],
};

for (const [table, columns] of Object.entries(requirements)) {
  if (!content.includes(`${table}: {`)) {
    console.error(`Missing table definition for ${table}`);
    process.exit(1);
  }
  for (const column of columns) {
    if (!content.includes(`${column}:`)) {
      console.error(`Missing column ${column} in ${table} definition`);
      process.exit(1);
    }
  }
}

console.log('Supabase types file contains expected tables and columns.');
