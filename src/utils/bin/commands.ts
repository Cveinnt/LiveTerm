// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';

// Help
export const help = async (args: string[]): Promise<string> => {
  const commands = Object.keys(bin).sort().join(', ');
  var c = '';
  for (let i = 1; i <= Object.keys(bin).sort().length; i++) {
    if (i % 7 === 0) {
      c += Object.keys(bin).sort()[i - 1] + '\n';
    } else {
      c += Object.keys(bin).sort()[i - 1] + ' ';
    }
  }
  return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// Redirection
export const repo = async (args: string[]): Promise<string> => {
  window.open(`${config.repo}`);
  return 'Opening Github repository...';
};

// About
export const about = async (args: string[]): Promise<string> => {
  return `Hi, I am ${config.name}. 
Welcome to my terminal!
More about me:
'readme' - my github readme.
'sumfetch' - short summary.
'resume' - my latest resume.
`;
};

export const resume = async (args: string[]): Promise<string> => {
  window.open(`${config.resume_url}`);
  return 'Opening resume...';
};

// Donate
export const donate = async (args: string[]): Promise<string> => {
  return `thank you for your interest. 
here are the ways you can support my work:
- <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.fake}" target="_blank">${config.donate_urls.paypal}</a></u>
- <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.fake}" target="_blank">${config.donate_urls.patreon}</a></u>
`;
};

// Contact
export const email = async (args: string[]): Promise<string> => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);
  return 'Opening github...';
};

// export const linkedin = async (args: string[]): Promise<string> => {
//   window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);
//   return 'Opening linkedin...';
// };

// Search
// export const google = async (args: string[]): Promise<string> => {
//   window.open(`https://google.com/search?q=${args.join(' ')}`);
//   return `Searching google for ${args.join(' ')}...`;
// };

// export const duckduckgo = async (args: string[]): Promise<string> => {
//   window.open(`https://duckduckgo.com/?q=${args.join(' ')}`);
//   return `Searching duckduckgo for ${args.join(' ')}...`;
// };

// export const bing = async (args: string[]): Promise<string> => {
//   window.open(`https://bing.com/search?q=${args.join(' ')}`);
//   return `Wow, really? You are using bing for ${args.join(' ')}?`;
// };

// export const reddit = async (args: string[]): Promise<string> => {
//   window.open(`https://www.reddit.com/search/?q=${args.join(' ')}`);
//   return `Searching reddit for ${args.join(' ')}...`;
// };

// Typical linux commands
export const logout = async (args: string[]): Promise<string> => {
  return `shell: logout: not login shell: use \`exit\'`;
}

export const exit = async (args: string[]): Promise<string> => {
  setTimeout(() => {open(`location`, '_self').close()}, 1000);
  return `Connection to ${config.ps1_hostname} closed.`;
}

export const echo = async (args: string[]): Promise<string> => {
  return args.join(' ');
};

export const whoami = async (args: string[]): Promise<string> => {
  return `${config.ps1_username}`;
};

export const ls = async (args: string[]): Promise<string> => {
  return `a
bunch
of
fake
directories`;
};

export const cd = async (args: string[]): Promise<string> => {
  return `unfortunately, i cannot afford more directories.
if you want to help, you can type 'donate'.`;
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};

export const vi = async (args: string[]): Promise<string> => {
  return `woah, you still use 'vi'? just try 'vim'.`;
};

export const vim = async (args: string[]): Promise<string> => {
  return `'vim' is so outdated. how about 'nvim'?`;
};

export const nvim = async (args: string[]): Promise<string> => {
  return `'nvim'? too fancy. why not 'emacs'?`;
};

export const emacs = async (args?: string[]): Promise<string> => {
  return `you know what? just use vscode.`;
};

export const sudo = async (args?: string[]): Promise<string> => {
  window.open(config.fake, '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

// Banner
export const banner = (args?: string[]): string => {
  return `
  █████ █████  ███                                           
  ░░███ ░░███  ░░░                                            
   ░░███ ███   ████  ████████   ██████     ████████    ███████
    ░░█████   ░░███ ░░███░░███ ███░░███   ░░███░░███  ███░░███
     ░░███     ░███  ░███ ░███░███████     ░███ ░███ ░███ ░███
      ░███     ░███  ░███ ░███░███░░░      ░███ ░███ ░███ ░███
      █████    █████ ░███████ ░░██████  ██ ████ █████░░███████
     ░░░░░    ░░░░░  ░███░░░   ░░░░░░  ░░ ░░░░ ░░░░░  ░░░░░███
                     ░███                             ███ ░███
                     █████                           ░░██████ 
                    ░░░░░                             ░░░░░░  

Type 'readme' to display my github readme.
Type 'sumfetch' to display summary.
Type 'help' to see the list of available commands.
`;
// Type 'repo' or click <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.repo}" target="_blank">here</a></u> for the Github repository.
};
