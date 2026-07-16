import config from '../../../config.json';
import {
  profile,
  experience,
  projects,
  education,
  organizations,
  publications,
  skills,
  catLabel,
} from '../resume';

const key = (k: string, w = 11) => `<span class="sf-key">${k.padEnd(w)}</span>`;
const title = (t: string) => `<span class="sf-title">${t}</span>`;
const sfLink = (href: string, text: string) =>
  `<a class="sf-link" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

// --- sumfetch: clean flat profile card (the landing screen) ---
const sumfetch = async (_args: string[]): Promise<string> => {
  const edu = education[0] ?? ({} as any);
  const contact = [
    `  ${key('email')}${sfLink(`mailto:${profile.email}`, profile.email)}`,
    `  ${key('github')}${sfLink(
      `https://github.com/${profile.github}`,
      `github.com/${profile.github}`,
    )}`,
    `  ${key('linkedin')}${sfLink(
      `https://linkedin.com/in/${profile.linkedin}`,
      `linkedin.com/in/${profile.linkedin}`,
    )}`,
    profile.phone ? `  ${key('phone')}${profile.phone}` : '',
  ].filter(Boolean);

  const eduBlock = [
    `  ${edu.school}`,
    ...(edu.degrees ?? []).map((d: string) => `    ${d}`),
    `    GPA ${edu.gpa} · Graduation ${edu.graduation}`,
  ];

  const expBlock = experience.map(
    (e) => `  ${e.role} @ ${e.company}  (${e.dates})`,
  );
  const projBlock = projects.slice(0, 4).map((p) => `  ${p.name}`);
  const skillBlock = Object.entries(skills).map(
    ([cat, items]) => `  ${key(catLabel(cat))}${items.join(', ')}`,
  );

  const system = [
    `  ${key('age')}<span data-sum-age>—</span>`,
    profile.citizenship ? `  ${key('citizen')}${profile.citizenship}` : '',
    `  ${key('datetime')}<span data-sum-dt>—</span>`,
  ].filter(Boolean);

  return `<span class="sumfetch"><span class="sf-name">${profile.name}</span>
  ${profile.bio}

${title('contact')}
${contact.join('\n')}

${title('education')}
${eduBlock.join('\n')}

${title('experience')}
${expBlock.join('\n')}

${title('projects')}
${projBlock.join('\n')}

${title('skills')}
${skillBlock.join('\n')}

${title('system')}
${system.join('\n')}

type '${sfLink(
    config.resume_url,
    'resume',
  )}' or 'help' · 'ls' to browse sections</span>`;
};

// --- summary: full-text profile (everything, flat) ---
export const summary = async (_args: string[]): Promise<string> => {
  const b = (s: string) => `  • ${s}`;
  const blocks: string[] = [];

  blocks.push(`${profile.name}\n${profile.bio}`);

  blocks.push(
    [
      title('EDUCATION'),
      ...education.map((e) =>
        [
          `${e.school}`,
          ...e.degrees.map((d) => `  ${d}`),
          `  GPA ${e.gpa} · Graduation ${e.graduation}`,
        ].join('\n'),
      ),
    ].join('\n'),
  );

  blocks.push(
    [
      title('EXPERIENCE'),
      ...experience.map(
        (e) =>
          `${e.role} @ ${e.company}  (${e.dates})\n${e.bullets
            .map(b)
            .join('\n')}`,
      ),
    ].join('\n\n'),
  );

  blocks.push(
    [
      title('PROJECTS'),
      ...projects.map(
        (p) => `${p.name}  [${p.timeline}]\n${p.bullets.map(b).join('\n')}`,
      ),
    ].join('\n\n'),
  );

  blocks.push(
    [
      title('ORGANIZATIONS'),
      ...organizations.map(
        (o) =>
          `${o.role} @ ${o.org}  (${o.dates})\n${o.bullets.map(b).join('\n')}`,
      ),
    ].join('\n\n'),
  );

  blocks.push(
    [
      title('PUBLICATIONS'),
      ...publications.map((p) => `${p.title}\n  ${p.status}`),
    ].join('\n\n'),
  );

  blocks.push(
    [
      title('SKILLS'),
      ...Object.entries(skills).map(
        ([cat, items]) =>
          `${(catLabel(cat) + ':').padEnd(13)}${items.join(', ')}`,
      ),
    ].join('\n'),
  );

  return blocks.join('\n\n');
};

export { sumfetch };
