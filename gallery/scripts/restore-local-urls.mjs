#!/usr/bin/env node
/**
 * restore-local-urls.mjs
 *
 * Restores photos-normalized.json from the local backup
 * (photos-normalized.local.json) so local dev works again after
 * the R2 upload replaced the URLs.
 *
 * Usage: node scripts/restore-local-urls.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT      = join(__dirname, '..');

const backupPath = join(ROOT, 'public', 'photos-normalized.local.json');
const mainPath   = join(ROOT, 'public', 'photos-normalized.json');

if (!existsSync(backupPath)) {
  console.error('❌  No backup found at public/photos-normalized.local.json');
  console.error('   Run the upload script first: node scripts/upload-to-r2.mjs');
  process.exit(1);
}

writeFileSync(mainPath, readFileSync(backupPath));
console.log('✅  Restored photos-normalized.json to local /images/... URLs');
console.log('   Restart the dev server: npm run dev');
