import React from 'react';
import { History } from './interface';

export const useHistory = (defaultValue: Array<History>) => {
  const [history, setHistory] = React.useState<Array<History>>(defaultValue);
  const [command, setCommand] = React.useState<string>('');
  const [lastCommandIndex, setLastCommandIndex] = React.useState<number>(0);

  return {
    history,
    command,
    lastCommandIndex,
    setHistory: (value: string) =>
      setHistory((prev) => [
        ...prev,
        {
          id: prev.length,
          date: new Date(),
          command,
          output: value,
        },
      ]),
    updateHistory: (index: number, value: string) =>
      setHistory((prev) =>
        prev.map((entry, i) => (i === index ? { ...entry, output: value } : entry)),
      ),
    setCommand,
    setLastCommandIndex,
    clearHistory: () => setHistory([]),
  };
};
