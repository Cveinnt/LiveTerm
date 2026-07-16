#!/usr/bin/env node
// =============================================================================
// Module contract  (praxis: Contract-First Modules · Tangle Discipline)
//
//   provides  — render the plain résumé page (public/resume.html) from the
//               resume.json mirror + resume.template.html. One concern: json ->
//               styled HTML. The template owns the design (hand-maintained); the
//               content is generated so the plain page and terminal share one
//               source (Single Source of Truth).
//   requires  — resume.json (generated from resume.org), resume.template.html.
//   tests must show —
//     * every section renders one card per item with its bullets/tech/meta;
//     * courses render as filterable pills; each card/pill has data-search;
//     * output is byte-stable so the CI canary (regen + diff) only trips on
//       real drift; text is HTML-escaped; arXiv ids linkify.
//
// Flow is ONE-WAY: resume.json -> public/resume.html. Never hand-edit the
// generated page; edit resume.org (content) or resume.template.html (design).
// Usage: node scripts/build-resume-html.mjs [--check]
// =============================================================================

import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'resume.json';
const TEMPLATE = 'resume.template.html';
const OUT = 'public/resume.html';

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// arXiv ids become links; run after escaping (ids are digits/dots, escape-safe).
const linkifyArxiv = (s) =>
  s.replace(
    /arXiv:(\d{4}\.\d{4,5})/gi,
    (_m, id) => `<a href="https://arxiv.org/abs/${id}">arXiv:${id}</a>`,
  );

const searchKey = (...parts) =>
  esc(
    parts.flat().filter(Boolean).join(' ').toLowerCase().replace(/\s+/g, ' '),
  );

const tagList = (tech) =>
  tech && tech.length
    ? `\n        <ul class="tag-list">${tech
        .map((t) => `<li class="tag">${esc(t)}</li>`)
        .join('')}</ul>`
    : '';

const bulletList = (bullets) =>
  bullets && bullets.length
    ? `\n        <ul class="bullet-list">${bullets
        .map((x) => `<li>${linkifyArxiv(esc(x))}</li>`)
        .join('')}</ul>`
    : '';

const metaBlock = (lines) => {
  const kept = lines.filter(Boolean);
  if (!kept.length) return '';
  return `\n          <div class="card-meta">${kept
    .map((l) => `<span class="meta-line">${esc(l)}</span>`)
    .join('')}</div>`;
};

const card = ({ title, subtitle, meta = [], tech, bullets, search }) => `
      <article class="card" data-search="${search}">
        <div class="card-header">
          <div>
            <h3 class="card-title">${esc(title)}</h3>${
  subtitle ? `\n            <p class="card-subtitle">${esc(subtitle)}</p>` : ''
}
          </div>${metaBlock(meta)}
        </div>${tagList(tech)}${bulletList(bullets)}
      </article>`;

const section = (id, heading, inner) =>
  `    <section id="${id}">\n      <h2 class="section-title">${esc(
    heading,
  )}</h2>\n${inner}\n    </section>`;

function render(data) {
  const {
    profile,
    experience,
    projects,
    organizations,
    publications,
    education,
  } = data;
  const edu = education[0] || {};

  const eduCard = card({
    title: edu.school,
    subtitle: edu.subtitle,
    meta: [`Expected Graduation · ${edu.graduation}`, `GPA · ${edu.gpa}`],
    bullets: null,
    search: searchKey(edu.school, edu.subtitle, edu.degrees, edu.honors),
  });
  const eduScholar =
    edu.honors && edu.honors.length
      ? `\n        <div class="scholarships">\n          <p class="scholarships-title">Scholarships &amp; Distinctions</p>\n          <ul class="bullet-list">${edu.honors
          .map((h) => `<li>${esc(h)}</li>`)
          .join('')}</ul>\n        </div>`
      : '';
  // inject scholarships before the closing </article> of the education card
  const eduHtml = eduCard.replace(
    '\n      </article>',
    `${eduScholar}\n      </article>`,
  );
  const educationSection = section(
    'education',
    'Education',
    `      <div class="education-grid">${eduHtml}\n      </div>`,
  );

  const experienceSection = section(
    'work',
    'Work Experience',
    experience
      .map((e) =>
        card({
          title: `${e.role} · ${e.company}`,
          subtitle: e.subtitle,
          meta: [e.dates, e.location],
          tech: e.tech,
          bullets: e.bullets,
          search: searchKey(
            e.role,
            e.company,
            e.subtitle,
            e.location,
            e.tech,
            e.bullets,
          ),
        }),
      )
      .join('\n'),
  );

  const projectsSection = section(
    'projects',
    'Projects',
    projects
      .map((p) =>
        card({
          title: p.name,
          subtitle: p.subtitle,
          meta: [p.timeline],
          tech: p.tech,
          bullets: p.bullets,
          search: searchKey(p.name, p.subtitle, p.tech, p.bullets),
        }),
      )
      .join('\n'),
  );

  const orgsSection = section(
    'organizations',
    'Organizations',
    organizations
      .map((o) =>
        card({
          title: `${o.role} · ${o.org}`,
          meta: [o.dates],
          bullets: o.bullets,
          search: searchKey(o.role, o.org, o.bullets),
        }),
      )
      .join('\n'),
  );

  const pubsSection = section(
    'publications',
    'Publications',
    publications
      .map((p) =>
        card({
          title: p.title,
          subtitle: p.status,
          bullets: p.bullets,
          search: searchKey(p.title, p.status, p.bullets),
        }),
      )
      .join('\n'),
  );

  const pills = (edu.coursework || [])
    .map(
      (c) =>
        `          <span class="course-pill" data-search="${searchKey(
          c,
        )}">${esc(c)}</span>`,
    )
    .join('\n');
  const coursesSection = section(
    'courses',
    'Relevant Courses',
    `      <div class="courses-card">\n        <div class="courses-grid" id="courses-grid">\n${pills}\n        </div>\n      </div>`,
  );

  const sections = [
    educationSection,
    experienceSection,
    projectsSection,
    orgsSection,
    pubsSection,
    coursesSection,
  ].join('\n\n');

  const headerSub = `Dual Degree · ${(edu.degrees || []).join(' & ')} · GPA ${
    edu.gpa
  }`;

  return readFileSync(TEMPLATE, 'utf8')
    .replace('{{NAME}}', esc(profile.name))
    .replace('{{HEADER_SUB}}', esc(headerSub))
    .replace('{{SECTIONS}}', sections);
}

function main() {
  const check = process.argv.includes('--check');
  const html = render(JSON.parse(readFileSync(SRC, 'utf8')));

  if (check) {
    let current = '';
    try {
      current = readFileSync(OUT, 'utf8');
    } catch {
      /* missing counts as drift */
    }
    if (current !== html) {
      process.stderr.write(
        `DRIFT: ${OUT} is out of sync. Run: node scripts/build-resume-html.mjs\n`,
      );
      process.exit(1);
    }
    process.stdout.write(`ok: ${OUT} matches ${SRC}\n`);
    return;
  }
  writeFileSync(OUT, html);
  process.stdout.write(`wrote ${OUT} from ${SRC}\n`);
}

main();
