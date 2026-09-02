#!/usr/bin/env node
/*
Small utility to import a Joplin Markdown export into the site.

Usage:
  1) Export notebook from Joplin as Markdown (with resources) into a folder, e.g. ./tmp/joplin-export
     (Joplin GUI: Export > Markdown with resources) or use `joplin export` CLI.
  2) Run: `node scripts/joplin-to-site.js ./tmp/joplin-export`

What it does (minimal, low-bloat):
  - Normalizes/ensures YAML frontmatter (title, date, tags, readingTime left to site build)
  - Chooses category by tag: uses `hacksmarter` tag -> `hacksmarter`, otherwise `htb`
  - Copies exported resource images into `public/images/writeups/machines/<category>/<slug>/`
  - Copies the first image as a cover into `public/images/writeups/covers/<category>/<slug>-cover.<ext>`
  - Rewrites image links inside the Markdown to point to the moved files
  - Writes the final Markdown into `src/content/writeups/<category>/<slug>.md`

Notes:
  - This script uses only Node builtins and `gray-matter` which the project already depends on.
  - Adjust logic if your Joplin export layout differs (resource folder naming).
*/

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const argv = process.argv.slice(2);
if (!argv[0]) {
  console.error('Usage: node scripts/joplin-to-site.js <joplin-export-dir>');
  process.exit(1);
}

const inDir = path.resolve(argv[0]);
const outBase = path.resolve('src/content/writeups');
const publicBase = path.resolve('public/images/writeups');

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/["'`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 200);
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function findResourceDir(noteBase) {
  const candidates = [
    path.join(inDir, noteBase + '.resources'),
    path.join(inDir, noteBase + '_resources'),
    path.join(inDir, noteBase + '.attachments'),
    path.join(inDir, 'resources'),
    path.join(inDir, 'resources_files'),
  ];
  for (const c of candidates) if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
  // fallback: any directory in inDir that contains image files
  const names = fs.readdirSync(inDir);
  for (const n of names) {
    const p = path.join(inDir, n);
    if (!fs.statSync(p).isDirectory()) continue;
    const files = fs.readdirSync(p);
    if (files.some(f => /\.(png|jpe?g|gif|svg)$/i.test(f))) return p;
  }
  return null;
}

const entries = fs.readdirSync(inDir).filter(f => f.endsWith('.md'));
if (entries.length === 0) {
  console.error('No markdown files found in', inDir);
  process.exit(1);
}

for (const file of entries) {
  const filePath = path.join(inDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const content = parsed.content || '';
  const data = parsed.data || {};

  // Ensure basic frontmatter
  data.title = data.title || (content.split('\n')[0] || file.replace('.md', '')).replace(/^#\s*/, '').trim();
  data.date = data.date || new Date().toISOString().split('T')[0];
  data.tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [String(data.tags)] : (data.category ? [String(data.category)] : []));
  // Determine category
  const lowerTags = (data.tags || []).map(t => String(t).toLowerCase());
  const category = lowerTags.includes('hacksmarter') ? 'hacksmarter' : 'htb';

  const baseName = path.basename(file, '.md');
  const resourceDir = findResourceDir(baseName);

  const slug = slugify(data.title || baseName);
  const outDir = path.join(outBase, category);
  ensureDir(outDir);

  // Destination image folder for this post
  const destImgDir = path.join(publicBase, 'machines', category, slug);
  ensureDir(destImgDir);

  // Copy resources and rewrite links
  let newContent = content;
  let firstImage = null;
  if (resourceDir) {
    const resources = fs.readdirSync(resourceDir).filter(f => !f.startsWith('.'));
    for (const r of resources) {
      const src = path.join(resourceDir, r);
      const dest = path.join(destImgDir, r);
      try { fs.copyFileSync(src, dest); } catch (err) { console.error('copy failed', src, err); }
      if (!firstImage && /\.(png|jpe?g|gif|svg)$/i.test(r)) firstImage = r;
      // replace occurrences of the filename in the markdown with the new path
      const escaped = r.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const re = new RegExp(escaped, 'g');
      newContent = newContent.replace(re, path.posix.join('/images/writeups/machines', category, slug, r));
    }
  }

  // Set or copy cover image
  if (!data.coverImage && firstImage) {
    const ext = path.extname(firstImage) || '.png';
    const coversDir = path.join(publicBase, 'covers', category);
    ensureDir(coversDir);
    const coverName = `${slug}-cover${ext}`;
    try {
      fs.copyFileSync(path.join(destImgDir, firstImage), path.join(coversDir, coverName));
      data.coverImage = path.posix.join('/images/writeups/covers', category, coverName);
    } catch (err) {
      // ignore
    }
  }

  // If coverImage is present but points to a relative resource, normalize it
  if (data.coverImage && typeof data.coverImage === 'string' && !data.coverImage.startsWith('/')) {
    // if the cover image exists in resourceDir, copy and set to covers
    const coverCandidate = path.basename(data.coverImage);
    const srcCover = resourceDir ? path.join(resourceDir, coverCandidate) : null;
    if (srcCover && fs.existsSync(srcCover)) {
      const ext = path.extname(coverCandidate) || '.png';
      const coversDir = path.join(publicBase, 'covers', category);
      ensureDir(coversDir);
      const coverName = `${slug}-cover${ext}`;
      try { fs.copyFileSync(srcCover, path.join(coversDir, coverName)); data.coverImage = path.posix.join('/images/writeups/covers', category, coverName); } catch (e) {}
    }
  }

  // Finalize frontmatter fields defaults
  data.readingTime = data.readingTime || 1;
  data.author = data.author || 'pir4cy';

  // Write final markdown
  const outContent = matter.stringify(newContent, data);
  const outPath = path.join(outDir, slug + '.md');
  fs.writeFileSync(outPath, outContent, 'utf8');
  console.log('wrote', outPath);
}

console.log('done. Review files in', path.resolve(outBase));
