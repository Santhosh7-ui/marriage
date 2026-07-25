#!/usr/bin/env node
/**
 * upload-to-r2.mjs
 *
 * Uploads all thumbnails + gallery WebPs to Cloudflare R2, then regenerates
 * public/photos-normalized.json so every URL points at R2 instead of /images/...
 *
 * Usage:
 *   export R2_ACCOUNT_ID="..."
 *   export R2_ACCESS_KEY_ID="..."
 *   export R2_SECRET_ACCESS_KEY="..."
 *   export R2_BUCKET_NAME="wedding-gallery"
 *   export R2_PUBLIC_URL="https://pub-XXXX.r2.dev"
 *
 *   node scripts/upload-to-r2.mjs
 *
 * Options (env vars):
 *   R2_CONCURRENCY   Number of parallel uploads (default: 10)
 *   R2_DRY_RUN       Set to "1" to list files without uploading
 *   R2_SKIP_EXISTING Set to "1" to skip files already in R2 (default: 1)
 */

import { S3Client, HeadObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT      = join(__dirname, '..');

// ─── Config ───────────────────────────────────────────────────────────────────

const ACCOUNT_ID    = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY    = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY    = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET        = process.env.R2_BUCKET_NAME    || 'wedding-gallery';
const PUBLIC_URL    = process.env.R2_PUBLIC_URL;        // e.g. https://pub-XXXX.r2.dev
const CONCURRENCY   = Number(process.env.R2_CONCURRENCY   || '10');
const DRY_RUN       = process.env.R2_DRY_RUN       === '1';
const SKIP_EXISTING = process.env.R2_SKIP_EXISTING  !== '0'; // default true

// Validate
if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY || !PUBLIC_URL) {
  console.error('\n❌  Missing required environment variables.\n');
  console.error('   Set these before running:\n');
  console.error('   export R2_ACCOUNT_ID="your_account_id"');
  console.error('   export R2_ACCESS_KEY_ID="your_access_key"');
  console.error('   export R2_SECRET_ACCESS_KEY="your_secret_key"');
  console.error('   export R2_PUBLIC_URL="https://pub-XXXX.r2.dev"');
  console.error('   export R2_BUCKET_NAME="wedding-gallery"  # optional, default shown\n');
  process.exit(1);
}

// ─── S3 client pointed at R2 ──────────────────────────────────────────────────

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mimeType(file) {
  if (file.endsWith('.webp')) return 'image/webp';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  if (file.endsWith('.png'))  return 'image/png';
  if (file.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

async function objectExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(localPath, r2Key) {
  if (DRY_RUN) {
    console.log(`  [DRY] ${r2Key}`);
    return;
  }
  if (SKIP_EXISTING && await objectExists(r2Key)) {
    return 'skipped';
  }

  const body        = createReadStream(localPath);
  const contentType = mimeType(localPath);

  await s3.send(new PutObjectCommand({
    Bucket:             BUCKET,
    Key:                r2Key,
    Body:               body,
    ContentType:        contentType,
    CacheControl:       'public, max-age=31536000, immutable',
  }));

  return 'uploaded';
}

/** Collect all files recursively from a directory */
function collectFiles(dir, base = dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, base));
    } else {
      results.push({ localPath: full, r2Key: relative(base, full).replace(/\\/g, '/') });
    }
  }
  return results;
}

/** Simple concurrency pool */
async function runPool(tasks, concurrency, fn) {
  let index  = 0;
  let done   = 0;
  const total = tasks.length;

  async function worker() {
    while (index < total) {
      const i    = index++;
      const task = tasks[i];
      const result = await fn(task);
      done++;

      const pct = ((done / total) * 100).toFixed(1);
      const status = result === 'skipped' ? '⏭' : result === 'uploaded' ? '✓' : '·';
      process.stdout.write(`\r  ${status} ${done}/${total}  (${pct}%)  ${basename(task.localPath)}`.padEnd(80));
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stdout.write('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   Cloudflare R2 Upload — Wedding Gallery ║');
  console.log('╚══════════════════════════════════════════╝\n');
  console.log(`  Bucket:      ${BUCKET}`);
  console.log(`  Public URL:  ${PUBLIC_URL}`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log(`  Dry run:     ${DRY_RUN}`);
  console.log(`  Skip existing: ${SKIP_EXISTING}\n`);

  const imagesDir = join(ROOT, 'public', 'images');

  // Collect thumbnails and gallery images
  const thumbDir   = join(imagesDir, 'thumbnails');
  const galleryDir = join(imagesDir, 'gallery');

  console.log('  Scanning files…');
  const thumbFiles   = collectFiles(thumbDir,   imagesDir).map(f => ({
    ...f, r2Key: `images/${f.r2Key}`
  }));
  const galleryFiles = collectFiles(galleryDir, imagesDir).map(f => ({
    ...f, r2Key: `images/${f.r2Key}`
  }));

  const allFiles = [...thumbFiles, ...galleryFiles];
  console.log(`  Found ${thumbFiles.length} thumbnails + ${galleryFiles.length} gallery images = ${allFiles.length} total\n`);

  if (allFiles.length === 0) {
    console.error('  ❌  No files found. Check that public/images/thumbnails/ and public/images/gallery/ exist.');
    process.exit(1);
  }

  // ── Upload ──────────────────────────────────────────────────────────────────
  console.log('  Uploading…');
  const startTime = Date.now();

  await runPool(allFiles, CONCURRENCY, async ({ localPath, r2Key }) => {
    return uploadFile(localPath, r2Key);
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n  ✅  Upload complete in ${elapsed}s\n`);

  if (DRY_RUN) {
    console.log('  (Dry run — photos-normalized.json was NOT modified)\n');
    return;
  }

  // ── Regenerate photos-normalized.json with R2 URLs ─────────────────────────
  console.log('  Regenerating photos-normalized.json with R2 URLs…');

  const jsonPath   = join(ROOT, 'public', 'photos-normalized.json');
  const photos     = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  // Backup original
  const backupPath = join(ROOT, 'public', 'photos-normalized.local.json');
  writeFileSync(backupPath, readFileSync(jsonPath));
  console.log(`  Backed up original → photos-normalized.local.json`);

  // Replace /images/... URLs with R2 public URL
  const updated = photos.map(photo => ({
    ...photo,
    thumbnail: `${PUBLIC_URL}/images/thumbnails/${basename(photo.thumbnail)}`,
    gallery:   `${PUBLIC_URL}/images/gallery/${basename(photo.gallery)}`,
  }));

  writeFileSync(jsonPath, JSON.stringify(updated, null, 2));
  console.log(`  ✅  photos-normalized.json updated with R2 URLs\n`);

  // ── Verify a sample URL ─────────────────────────────────────────────────────
  if (updated.length > 0) {
    const sample = updated[0].thumbnail;
    console.log('  Verifying a sample URL…');
    console.log(`  → ${sample}`);
    try {
      const res = await fetch(sample, { method: 'HEAD' });
      if (res.ok) {
        console.log(`  ✅  Reachable! (HTTP ${res.status})\n`);
      } else {
        console.warn(`  ⚠️   HTTP ${res.status} — bucket may not be public yet. Check R2 public access settings.\n`);
      }
    } catch (e) {
      console.warn(`  ⚠️   Could not verify: ${e.message}\n`);
    }
  }

  console.log('╔══════════════════════════════════════════╗');
  console.log('║   All done! Next step:                   ║');
  console.log('║   Restart the dev server:                ║');
  console.log('║   npm run dev                            ║');
  console.log('╚══════════════════════════════════════════╝\n');
}

main().catch((e) => {
  console.error('\n❌  Fatal error:', e.message);
  process.exit(1);
});
