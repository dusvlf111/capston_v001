import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sqlPath = path.resolve(
  __dirname,
  '../../supabase/sql/3_6_submit_report_function.sql'
);

describe('submit_report RPC SQL', () => {
  it('defines the stored procedure with grants', () => {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    expect(sql).toContain('CREATE OR REPLACE FUNCTION public.submit_report');
    expect(sql).toContain('GRANT EXECUTE ON FUNCTION public.submit_report');
  });
});
