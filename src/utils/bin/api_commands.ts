// // List of commands that require API calls

import { getProjects } from '../api';
import { getQuote } from '../api';
import { getReadme } from '../api';
import { getWeather } from '../api';
import { getPostsDevTo } from '../api';

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  return projects
    .map(
      (repo) =>
        `${repo.name} - <a class="text-light-blue dark:text-dark-blue underline" href="${repo.html_url}" target="_blank">${repo.html_url}</a>`,
    )
    .join('\n');
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const readme = async (args: string[]): Promise<string> => {
  const readme = await getReadme();
  return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};

export const posts = async (args: string[]): Promise<string> => {
  const posts = await getPostsDevTo();
  if (posts.length) {
    return `My Latest posts on Dev.To:<br>${posts
      .map(
        (post) =>
          ` - <a class="text-light-blue dark:text-dark-blue underline" href="${post.url}" target="_blank">${post.title}</a>`,
      ).join('\n')}`;
  } else {
    return `I don't have any posts on Dev.to yet :(`;
  }
};