import * as bin from './bin';

export const handleTabCompletion = (
  command: string,
  setHistory: (value: string) => void,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
) => {
  const commands = ['clear', ...Object.keys(bin)].filter((entry) =>
    entry.startsWith(command),
  );

  if (commands.length >= 1) {
    const prefix = commands.reduce((prev, curr) => {
      let i = 0;
      while (i < prev.length && i < curr.length && prev[i] === curr[i])
        ++i;
      return prev.slice(0, i);
    }, commands[0]);
    setCommand(prefix);
    if (commands.length > 1)
      setHistory(commands.join(' '));
  }
};
