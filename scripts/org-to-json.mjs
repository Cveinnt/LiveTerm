#!/usr/bin/env node
// =============================================================================
// Module contract  (praxis: Contract-First Modules · The Docstring Is the Contract)
//
//   provides  — parse the canonical résumé (resume.org, RESUME_SCHEMA: 1) into a
//               deterministic JSON mirror (resume.json). One concern: org -> json.
//   requires  — Node >=18 (readFileSync, writeFileSync, JSON). No dependencies:
//               the schema is small and self-owned, so a maintained org parser
//               (orga / uniorg) would be more liability than a ~120-line reader.
//   tests must show —
//     * every `**` item heading with an :ID: becomes one object carrying its id;
//     * drawer keys map to lowercased fields; tagged bullets (`- k :: v`) route
//       into named arrays; plain bullets become `bullets`;
//     * skills categories and the profile drawer + bio prose are captured;
//     * output is byte-stable (sorted-nothing, fixed key order, 2-space, \n) so
//       the CI canary (regenerate + git diff) only trips on real drift.
//
// Flow is ONE-WAY: resume.org -> resume.json. Never hand-edit resume.json.
// Usage: node scripts/org-to-json.mjs [resume.org] [resume.json]
// With --check it regenerates in memory and exits non-zero if the file on disk
// differs (the drift canary), without writing.
// =============================================================================

import { readFileSync, writeFileSync } from 'node:fs';

const GENERATED_NOTE =
  'GENERATED FILE — do not edit. Source of truth: resume.org. ' +
  'Regenerate: node scripts/org-to-json.mjs';

// Section registry — the fixed schema the parser understands.
// `fields` are optional scalar drawer props (included only when present);
// `tagged` routes `- k :: v` bullets into named arrays; `list: false` means
// the item has no free-form bullets array (education is all tagged).
const SECTIONS = {
  profile: { kind: 'profile' },
  experience: {
    kind: 'items',
    fields: ['role', 'company', 'dates', 'subtitle', 'location'],
    tagged: { tech: 'tech' },
    list: true,
  },
  projects: {
    kind: 'items',
    fields: ['name', 'timeline', 'subtitle'],
    tagged: { tech: 'tech' },
    list: true,
  },
  education: {
    kind: 'items',
    fields: ['school', 'gpa', 'graduation', 'subtitle'],
    tagged: { degree: 'degrees', honor: 'honors', course: 'coursework' },
    list: false,
  },
  organizations: {
    kind: 'items',
    fields: ['role', 'org', 'dates'],
    list: true,
  },
  publications: { kind: 'items', fields: ['title', 'status'], list: true },
  skills: { kind: 'skills' },
};

const slug = (s) => s.trim().toLowerCase();
const isHeading = (l) => /^\*+\s/.test(l);
const headingLevel = (l) => (l.match(/^(\*+)\s/) || [, ''])[1].length;
const headingText = (l) => l.replace(/^\*+\s+/, '').trim();

// Read a :PROPERTIES: ... :END: drawer starting at `start`; return {props, next}.
function readDrawer(lines, start) {
  const props = {};
  let i = start + 1;
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === ':END:') return { props, next: i + 1 };
    const m = t.match(/^:([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) props[m[1].toLowerCase()] = m[2].trim();
  }
  throw new Error(`Unterminated :PROPERTIES: drawer at line ${start + 1}`);
}

// Build one item object from its heading, drawer props, and bullet lines.
function makeItem(cfg, props, bullets) {
  const item = {};
  if (props.id) item.id = props.id;
  for (const f of cfg.fields) if (props[f] != null) item[f] = props[f];
  const tagged = cfg.tagged || {};
  for (const key of Object.values(tagged)) item[key] = [];
  const plain = [];
  for (const raw of bullets) {
    const m = raw.match(/^([A-Za-z0-9_]+)\s*::\s*(.*)$/);
    if (m && tagged[m[1].toLowerCase()]) {
      item[tagged[m[1].toLowerCase()]].push(m[2].trim());
    } else {
      plain.push(raw);
    }
  }
  // Drop empty tagged arrays so optional groups (e.g. tech) don't add noise.
  for (const key of Object.values(tagged))
    if (item[key].length === 0) delete item[key];
  if (cfg.list) item.bullets = plain;
  return item;
}

function parse(text) {
  const lines = text.split(/\r?\n/);
  const out = {
    profile: {},
    experience: [],
    projects: [],
    education: [],
    organizations: [],
    publications: [],
    skills: {},
  };
  const bioLines = [];
  let section = null; // {key, cfg}
  let itemProps = null; // drawer of the open item
  let itemBullets = null; // bullets of the open item
  let skillCat = null; // {key, list}

  const flushItem = () => {
    if (section && section.cfg.kind === 'items' && itemProps !== null) {
      out[section.key].push(makeItem(section.cfg, itemProps, itemBullets));
    }
    itemProps = null;
    itemBullets = null;
  };
  const flushSkill = () => {
    if (skillCat) out.skills[skillCat.key] = skillCat.list;
    skillCat = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (t.startsWith('#') || t === '') continue; // comments, keywords, blanks

    if (t === ':PROPERTIES:') {
      const { props, next } = readDrawer(lines, i);
      i = next - 1;
      if (section && section.cfg.kind === 'items' && itemProps !== null) {
        Object.assign(itemProps, props);
      } else if (section && section.key === 'profile') {
        Object.assign(out.profile, props);
      }
      // file-level drawer (no section yet) is metadata — ignored.
      continue;
    }

    if (isHeading(line)) {
      const level = headingLevel(line);
      const label = headingText(line);
      if (level === 1) {
        flushItem();
        flushSkill();
        const key = slug(label);
        section = SECTIONS[key] ? { key, cfg: SECTIONS[key] } : null;
        if (!section)
          process.stderr.write(`warn: unknown section "${label}"\n`);
      } else if (level === 2 && section) {
        if (section.cfg.kind === 'items') {
          flushItem();
          itemProps = {};
          itemBullets = [];
        } else if (section.cfg.kind === 'skills') {
          flushSkill();
          skillCat = { key: slug(label), list: [] };
        }
      }
      continue;
    }

    if (t.startsWith('- ')) {
      const val = t.slice(2).trim();
      if (section && section.cfg.kind === 'items' && itemBullets)
        itemBullets.push(val);
      else if (section && section.cfg.kind === 'skills' && skillCat)
        skillCat.list.push(val);
      continue;
    }

    // free prose — only meaningful inside Profile (the bio).
    if (section && section.key === 'profile') bioLines.push(t);
  }
  flushItem();
  flushSkill();

  if (bioLines.length) out.profile.bio = bioLines.join(' ');
  return out;
}

// Stable serialization: fixed top-level key order, 2-space indent, trailing \n.
function serialize(data) {
  const ordered = {
    $generated: GENERATED_NOTE,
    profile: data.profile,
    experience: data.experience,
    projects: data.projects,
    education: data.education,
    organizations: data.organizations,
    publications: data.publications,
    skills: data.skills,
  };
  return JSON.stringify(ordered, null, 2) + '\n';
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--check');
  const check = process.argv.includes('--check');
  const src = args[0] || 'resume.org';
  const dst = args[1] || 'resume.json';

  const json = serialize(parse(readFileSync(src, 'utf8')));

  if (check) {
    let current = '';
    try {
      current = readFileSync(dst, 'utf8');
    } catch {
      /* missing file counts as drift */
    }
    if (current !== json) {
      process.stderr.write(
        `DRIFT: ${dst} is out of sync with ${src}. Run: node scripts/org-to-json.mjs\n`,
      );
      process.exit(1);
    }
    process.stdout.write(`ok: ${dst} matches ${src}\n`);
    return;
  }

  writeFileSync(dst, json);
  process.stdout.write(`wrote ${dst} from ${src}\n`);
}

main();
