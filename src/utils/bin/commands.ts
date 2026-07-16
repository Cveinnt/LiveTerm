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
import { getProjects, getQuote, getReadme, getWeather } from '../api';

const b = (s: string) => `  • ${s}`;
const link = (href: string, text: string) =>
  `<a class="term-link" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

// Turn "arXiv:2507.01246" mentions into a clickable link, in place.
const linkifyArxiv = (s: string) =>
  s.replace(/arXiv:(\d{4}\.\d{4,5})/gi, (_m, id) =>
    link(`https://arxiv.org/abs/${id}`, `arXiv:${id}`),
  );

export const help = async (_args: string[]): Promise<string> => {
  const cmds: [string, string][] = [
    ['about', 'short bio'],
    [
      'ls [section]',
      'browse résumé — experience projects education skills organizations publications',
    ],
    ['summary', 'full text profile'],
    ['sumfetch', 'profile card'],
    ['resume', 'open résumé page in a new tab'],
    ['email', 'open mailto link'],
    ['linkedin', 'open LinkedIn profile'],
    ['github', 'open GitHub profile'],
    ['github_projects', 'list public GitHub repos'],
    ['weather [city]', 'current weather'],
    ['quote', 'random quote'],
    ['clear', 'clear the terminal'],
  ];
  const rows = cmds
    .map(
      ([cmd, desc], i) =>
        `${i === cmds.length - 1 ? '└' : '├'} ${cmd.padEnd(18)}${desc}`,
    )
    .join('\n');
  return `Commands:\n${rows}\n\n[tab] complete  [ctrl+l] clear  [↑/↓] history`;
};

export const about = async (_args: string[]): Promise<string> => {
  return `${profile.name}\n${profile.bio}\n\ntype 'sumfetch' for the profile card, 'ls' to browse sections`;
};

const SECTIONS = [
  ['experience', 'professional history'],
  ['projects', 'things built'],
  ['education', 'degrees & coursework'],
  ['organizations', 'leadership roles'],
  ['publications', 'papers & writing'],
  ['skills', 'technical stack'],
] as const;

export const ls = async (args: string[]): Promise<string> => {
  const section = (args[0] ?? '').toLowerCase().replace(/\/$/, '');

  if (!section) {
    const rows = SECTIONS.map(([name, desc], i) => {
      const branch = i === SECTIONS.length - 1 ? '└' : '├';
      return `<span class="tree-branch">${branch}</span> <span class="tree-row">${name.padEnd(
        15,
      )}${desc}</span>`;
    }).join('\n');
    return `<span class="tree">~/\n${rows}</span>\n\nuse 'ls &lt;section&gt;' to read, e.g. 'ls experience'`;
  }

  switch (section) {
    case 'about':
      return `${profile.name}\n${profile.bio}`;

    case 'experience':
      return experience
        .map(
          (e) =>
            `${e.role} @ ${e.company}  (${e.dates})\n${e.bullets
              .map(b)
              .join('\n')}`,
        )
        .join('\n\n');

    case 'projects':
      return projects
        .map(
          (p) =>
            `${p.name}  [${p.timeline}]\n${p.bullets
              .map((x) => b(linkifyArxiv(x)))
              .join('\n')}`,
        )
        .join('\n\n');

    case 'education':
      return education
        .map((e) =>
          [
            e.school,
            e.degrees.map((d) => `  ${d}`).join('\n'),
            `  GPA: ${e.gpa} · Graduation: ${e.graduation}`,
            '',
            'Honors:',
            e.honors.map(b).join('\n'),
            '',
            'Coursework:',
            e.coursework.map(b).join('\n'),
          ].join('\n'),
        )
        .join('\n\n');

    case 'organizations':
      return organizations
        .map(
          (o) =>
            `${o.role} @ ${o.org}  (${o.dates})\n${o.bullets
              .map(b)
              .join('\n')}`,
        )
        .join('\n\n');

    case 'publications':
      return publications
        .map(
          (p) =>
            `${p.title}\n  ${linkifyArxiv(p.status)}\n${p.bullets
              .map((x) => b(linkifyArxiv(x)))
              .join('\n')}`,
        )
        .join('\n\n');

    case 'skills':
      return Object.entries(skills)
        .map(
          ([cat, items]) =>
            `${(catLabel(cat) + ':').padEnd(13)}${items.join(', ')}`,
        )
        .join('\n');

    default:
      return `ls: '${section}' not found\nSections: ${SECTIONS.map(
        ([n]) => n,
      ).join(', ')}`;
  }
};

export const resume = async (_args: string[]): Promise<string> => {
  window.open(config.resume_url);
  return 'Opening résumé...';
};

export const email = async (_args: string[]): Promise<string> => {
  window.open(`mailto:${profile.email}`);
  return `Opening mailto:${profile.email}...`;
};

export const github = async (_args: string[]): Promise<string> => {
  window.open(`https://github.com/${profile.github}/`);
  return 'Opening GitHub...';
};

export const linkedin = async (_args: string[]): Promise<string> => {
  window.open(`https://www.linkedin.com/in/${profile.linkedin}/`);
  return 'Opening LinkedIn...';
};

export const google = async (args: string[]): Promise<string> => {
  window.open(`https://google.com/search?q=${args.join(' ')}`);
  return `Searching google for ${args.join(' ')}...`;
};

export const duckduckgo = async (args: string[]): Promise<string> => {
  window.open(`https://duckduckgo.com/?q=${args.join(' ')}`);
  return `Searching duckduckgo for ${args.join(' ')}...`;
};

export const reddit = async (args: string[]): Promise<string> => {
  window.open(`https://www.reddit.com/search/?q=${args.join(' ')}`);
  return `Searching reddit for ${args.join(' ')}...`;
};

export const echo = async (args: string[]): Promise<string> => args.join(' ');

export const whoami = async (_args: string[]): Promise<string> =>
  config.ps1_username;

export const date = async (_args: string[]): Promise<string> =>
  new Date().toString();

export const vi = async (_args: string[]): Promise<string> =>
  `woah, you still use 'vi'? just try 'vim'.`;
export const vim = async (_args: string[]): Promise<string> =>
  `'vim' is so outdated. how about 'nvim'?`;
export const nvim = async (_args: string[]): Promise<string> =>
  `'nvim'? too fancy. why not 'emacs'?`;
export const emacs = async (_args?: string[]): Promise<string> =>
  `you know what? just use vscode.`;

export const sudo = async (_args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  return `Permission denied: with little power comes... no responsibility?`;
};

// --- API commands ---

export const github_projects = async (_args: string[]): Promise<string> => {
  const repos = await getProjects();
  return repos
    .map((repo: any) => `${repo.name} — ${link(repo.html_url, repo.html_url)}`)
    .join('\n');
};

export const quote = async (_args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const readme = async (_args: string[]): Promise<string> => {
  const data = await getReadme();
  return `Opening GitHub README...\n\n${data}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) return 'Usage: weather [city]. Example: weather london';
  return getWeather(city);
};
