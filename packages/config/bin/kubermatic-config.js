#!/usr/bin/env node
/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Enforces the dependency contract against a repo's package.json.
 *
 *   kubermatic-config check          # report drift, exit 1 if any
 *   kubermatic-config check --fix    # write the manifest in, then report
 *
 * This script exists because of a limitation worth stating plainly rather than
 * designing around: **npm and pnpm cannot inherit `overrides` from a
 * dependency.** A package cannot transitively pin its consumers' React. So the
 * manifest has to be copied into each product's package.json, and the only
 * thing that keeps the copy honest is a check that fails when it drifts.
 *
 * Anything claiming to pin singletons transitively from a published package is
 * either wrong or is quietly bundling a second copy of React.
 */

import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const require = createRequire(import.meta.url);
const manifest = require('../versions.json');

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const command = argv.find((a) => !a.startsWith('-')) ?? 'check';
const fix = argv.includes('--fix');
const cwd = resolve(readFlag('--cwd') ?? process.cwd());
const roleFlag = readFlag('--role');

/** @param {string} name */
function readFlag(name) {
  const inline = argv.find((a) => a.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

if (command !== 'check') {
  console.error(
    `Unknown command "${command}". Usage: kubermatic-config check [--fix] [--cwd <dir>] [--role product|library]`,
  );
  process.exit(2);
}

// ------------------------------------------------------------------ target

const pkgPath = join(cwd, 'package.json');
if (!existsSync(pkgPath)) {
  console.error(`No package.json at ${cwd}`);
  process.exit(2);
}

const raw = readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(raw);

const SINGLETONS = Object.keys(manifest.singletons);
const TOOLCHAIN = Object.keys(manifest.toolchain);

/*
 * A package that declares a singleton as a peer is a library: it is asking the
 * app to supply React rather than supplying its own. Products never do this,
 * so the inference is safe — and --role overrides it when it is not.
 */
const role =
  roleFlag ??
  (SINGLETONS.some((name) => pkg.peerDependencies?.[name])
    ? 'library'
    : 'product');

if (role !== 'product' && role !== 'library') {
  console.error(`--role must be "product" or "library", got "${role}"`);
  process.exit(2);
}

// ------------------------------------------------------------------ checks

/** @type {{level:'error'|'note', text:string, fixed?:boolean}[]} */
const findings = [];
let changed = false;

const error = (text, fixed) => findings.push({ level: 'error', text, fixed });
const note = (text) => findings.push({ level: 'note', text });

const dep = (name) =>
  pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? undefined;

// -- Category A: singletons -------------------------------------------------

if (role === 'product') {
  for (const [name, version] of Object.entries(manifest.singletons)) {
    const current = pkg.overrides?.[name];
    if (current === version) continue;

    if (fix) {
      pkg.overrides ??= {};
      pkg.overrides[name] = version;
      changed = true;
      error(`overrides.${name}: ${current ?? '(absent)'} -> ${version}`, true);
    } else {
      error(
        `overrides.${name} is ${current ?? 'absent'}; the manifest pins ${version}. ` +
          `Without the override, a transitive dependency can pull a second copy of ${name}.`,
      );
    }
  }
} else {
  // A library must not *bundle* a singleton. Two copies of React in one app is
  // the invalid-hook-call failure, and it is introduced here, not downstream.
  for (const name of SINGLETONS) {
    if (pkg.dependencies?.[name]) {
      error(
        `${name} is a direct dependency. It carries React context or hook identity ` +
          `and must be a peerDependency, or consumers get a second copy.`,
      );
    }
  }
  for (const [name, version] of Object.entries(manifest.singletons)) {
    if (!pkg.devDependencies?.[name]) continue;
    if (pkg.devDependencies[name] === version) continue;

    if (fix) {
      pkg.devDependencies[name] = version;
      changed = true;
      error(`devDependencies.${name} -> ${version}`, true);
    } else {
      error(
        `devDependencies.${name} is ${pkg.devDependencies[name]}; the manifest pins ${version}. ` +
          `The library should build and test against the version its consumers will run.`,
      );
    }
  }
}

// -- Category B: owned by the kit ------------------------------------------

if (role === 'product') {
  for (const name of manifest.owned) {
    const where = pkg.dependencies?.[name]
      ? 'dependencies'
      : pkg.devDependencies?.[name]
        ? 'devDependencies'
        : null;
    if (!where) continue;

    if (fix) {
      delete pkg[where][name];
      changed = true;
      error(`removed ${where}.${name} (owned by the kit)`, true);
    } else {
      error(
        `${where}.${name} is owned by @kubermatic/ui-kit / @kubermatic/ui-patterns and arrives transitively. ` +
          `Declaring it here re-opens the version split the kit exists to close.`,
      );
    }
  }
} else {
  // Owned packages moved from peer to direct dependency precisely so that the
  // choice stops being something a consumer can get wrong.
  for (const name of manifest.owned) {
    if (pkg.peerDependencies?.[name]) {
      error(
        `${name} is a peerDependency. It has no cross-boundary identity requirement, ` +
          `so it should be a direct dependency and disappear from consumers' manifests entirely.`,
      );
    }
  }
}

// -- Category C: toolchain --------------------------------------------------

for (const [name, version] of Object.entries(manifest.toolchain)) {
  const current = dep(name);
  // Not every repo uses every tool. Only pin what is actually declared —
  // forcing vitest onto a repo that does not test is noise, not enforcement.
  if (current === undefined || current === version) continue;

  const where = pkg.dependencies?.[name] ? 'dependencies' : 'devDependencies';
  if (fix) {
    pkg[where][name] = version;
    changed = true;
    error(`${where}.${name} -> ${version}`, true);
  } else {
    error(`${where}.${name} is ${current}; the manifest pins ${version}.`);
  }
}

// -- Banned paths -----------------------------------------------------------

if (role === 'product') {
  for (const path of manifest.bannedPaths) {
    if (!existsSync(join(cwd, path))) continue;
    // Deliberately not auto-removed: deleting a directory of components someone
    // is still importing is not a fix, it is an outage.
    error(
      `${path} exists. That is a local copy of the kit — delete it and import from ` +
        `@kubermatic/ui-kit, or add the missing primitive to the kit.`,
    );
  }
}

// -- Unresolved decisions ---------------------------------------------------

for (const [name, why] of Object.entries(manifest.pending)) {
  note(`${name} is unpinned. ${why}`);
}

// ------------------------------------------------------------------ output

if (changed) {
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

const errors = findings.filter((f) => f.level === 'error');
const unfixed = errors.filter((f) => !f.fixed);

console.log(`kubermatic-config check — ${pkg.name ?? cwd} (role: ${role})`);

for (const f of errors) {
  console.log(`  ${f.fixed ? 'fixed' : 'ERROR'}  ${f.text}`);
}
for (const f of findings.filter((f) => f.level === 'note')) {
  console.log(`  note   ${f.text}`);
}

if (!errors.length) {
  console.log('  ok     manifest applied, no drift');
}

if (changed) {
  console.log(
    '\npackage.json updated. Re-run your package manager to install.',
  );
}

if (unfixed.length) {
  console.log(
    `\n${unfixed.length} problem(s) need attention. ` +
      `Re-run with --fix to apply the ones that are mechanical.`,
  );
  process.exit(1);
}
