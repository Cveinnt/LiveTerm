import axios from 'axios';
import https from 'https';
import config from '../../config.json';

export const getProjects = async () => {
  const { data } = await axios.get(
    `https://api.github.com/users/${config.social.github}/repos`,
  );
  return data;
};

export const getReadme = async () => {
  const { data } = await axios.get(config.readmeUrl);
  return data;
};

export const getWeather = async (city: string) => {
  try {
    const { data } = await axios.get(`https://wttr.in/${city}?ATm`);
    return data;
  } catch (error) {
    return error;
  }
};

export const getQuote = async () => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL verification
    });
    const { data } = await axios.get('https://api.quotable.io/random', { httpsAgent: agent });
    return {
      quote: `“${data.content}” — ${data.author}`,
    };
  } catch (error) {
    return {
      quote: 'Unable to fetch a quote at the moment. Please try again later.',
    };
  }
};

