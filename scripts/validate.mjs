#!/usr/bin/env node
/**
 * Validate the distribution without connecting to an account or running a model.
 * Gemini's CLI validates its manifest separately. These checks protect Fintel's
 * endpoint, portable skill references and optional cross-provider source parity.
 */
import assert from 'node:assert/strict';
import { readdir, readFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

async function inventory(directory) {
  assert((await lstat(directory)).isDirectory(), `Not a directory: ${directory}`);
  const files = new Map();
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const location = path.join(current, entry.name);
      const relative = path.relative(directory, location);
      assert(!entry.name.startsWith('.') && !entry.isSymbolicLink(),
        `Unexpected hidden file or symlink: ${relative}`);
      if (entry.isDirectory()) await visit(location);
      else {
        assert(entry.isFile(), `Unexpected special file: ${relative}`);
        files.set(relative, await readFile(location));
      }
    }
  }
  await visit(directory);
  return files;
}

async function validate() {
  const args = process.argv.slice(2);
  assert(args.length === 0 || (args.length === 2 && args[0] === '--skills-source'),
    'Usage: node scripts/validate.mjs [--skills-source /path/to/canonical/skills]');
  const manifest = JSON.parse(await readFile(path.join(root, 'gemini-extension.json'), 'utf8'));
  assert.equal(manifest.name, 'fintel-gemini');
  assert.match(manifest.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
  assert.equal(typeof manifest.description, 'string');
  assert(manifest.description.trim(), 'Missing extension description');
  assert.equal(manifest.contextFileName, 'GEMINI.md');
  // Keep OAuth discovery and host approvals intact. Credentials, trust overrides,
  // subprocesses and provider-specific authentication do not belong in this package.
  assert.deepEqual(manifest.mcpServers, {
    fintel: { url: 'https://mcp.fintel.io/mcp', type: 'http' },
  });
  assert.deepEqual(Object.keys(manifest).sort(),
    ['name', 'version', 'description', 'contextFileName', 'mcpServers'].sort());
  for (const name of ['GEMINI.md', 'LICENSE', 'README.md']) {
    const location = path.join(root, name);
    assert((await lstat(location)).isFile(), `Missing regular file: ${name}`);
    assert((await readFile(location, 'utf8')).trim(), `Empty file: ${name}`);
  }

  const skillsRoot = path.join(root, 'skills');
  const files = await inventory(skillsRoot);
  const names = new Set();
  for (const [relative, data] of files) {
    const parts = relative.split(path.sep);
    assert(parts.length >= 2 && files.has(path.join(parts[0], 'SKILL.md')),
      `Resource has no owning skill: ${relative}`);
    assert(data.length <= 1024 * 1024, `Oversized resource: ${relative}`);
    const text = data.toString('utf8');
    if (path.basename(relative) === 'SKILL.md') {
      assert.equal(parts.length, 2, `Skill must be directly under skills/: ${relative}`);
      const metadata = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      assert(metadata, `Missing frontmatter: ${relative}`);
      // The Gemini skill validator requires a single-line description. Retain the
      // portable source's plain scalar metadata instead of rewriting shared skills.
      const name = metadata[1].match(/^name: ([a-z0-9]+(?:-[a-z0-9]+)*)\r?$/m)?.[1];
      const description = metadata[1].match(/^description: (.+)\r?$/m)?.[1]?.trim();
      assert.equal(name, parts[0], `Skill name/directory mismatch: ${relative}`);
      assert(name.length <= 64 && !names.has(name), `Invalid or duplicate name: ${relative}`);
      assert(description && description.length <= 1024, `Invalid description: ${relative}`);
      names.add(name);
    }
    if (!relative.endsWith('.md')) continue;
    for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) continue;
      const resolved = path.resolve(skillsRoot, path.dirname(relative), target.split('#')[0]);
      const owner = path.join(skillsRoot, parts[0]) + path.sep;
      assert(resolved.startsWith(owner), `Reference escapes its skill: ${relative}: ${target}`);
      assert(files.has(path.relative(skillsRoot, resolved)),
        `Missing reference: ${relative}: ${target}`);
    }
  }
  assert(names.size > 0, 'No skills found');
  if (args.length) {
    const source = await inventory(path.resolve(args[1]));
    assert.deepEqual([...files.keys()].sort(), [...source.keys()].sort(), 'Skill inventories differ');
    for (const [relative, data] of files) {
      assert(data.equals(source.get(relative)), `Skill source differs: ${relative}`);
    }
    console.log(`Source parity verified: ${files.size} files`);
  }
  console.log(`Validated ${manifest.name} ${manifest.version}: ${names.size} skills, ${files.size} skill/resource files`);
}

validate().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
