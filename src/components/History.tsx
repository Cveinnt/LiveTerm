import React from 'react';
import { Ps1 } from './Ps1';

export interface HistoryEntry {
  id: number;
  date: Date;
  command: string;
  output: string;
}

export const useHistory = (defaultValue: HistoryEntry[]) => {
  const [history, setHistory] = React.useState<HistoryEntry[]>(defaultValue);
  const [command, setCommand] = React.useState('');
  const [lastCommandIndex, setLastCommandIndex] = React.useState(0);

  return {
    history,
    command,
    lastCommandIndex,
    setHistory: (value: string) =>
      setHistory([
        ...history,
        { id: history.length, date: new Date(), command, output: value },
      ]),
    setCommand,
    setLastCommandIndex,
    clearHistory: () => setHistory([]),
  };
};

export const History: React.FC<{ history: HistoryEntry[] }> = ({ history }) => (
  <>
    {history.map((entry, index) => (
      <div key={entry.command + index}>
        <div className="flex flex-row space-x-2">
          <div className="flex-shrink">
            <Ps1 />
          </div>
          <div className="flex-grow">{entry.command}</div>
        </div>
        <p
          className="whitespace-pre-wrap mb-2"
          style={{ lineHeight: 'normal' }}
          dangerouslySetInnerHTML={{ __html: entry.output }}
        />
      </div>
    ))}
  </>
);
