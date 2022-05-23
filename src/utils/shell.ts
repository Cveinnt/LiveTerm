import React from 'react';
import * as bin from './bin';
import { getCommandIfHistoryExpansion, push as pushHistory } from './history';

export const shell = async (
  command: string,
  setHistory: (value: string) => void,
  clearHistory: () => void,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
) => {
  const args = command.split(' ');
  args[0] = args[0].toLowerCase().trim();

  let expandedCommand = getCommandIfHistoryExpansion(args[0]);
  if (expandedCommand) {
    // like bash with histverify on or zsh default
    setCommand(expandedCommand);
    return;
  }

  if (args[0] === 'clear') {
    pushHistory(args[0]);
    clearHistory();
  } else if (command === '') {
    setHistory('');
  } else if (Object.keys(bin).indexOf(args[0]) === -1) {
    pushHistory(args[0]);
    setHistory(
      `shell: command not found: ${args[0]}. Try 'help' to get started.`,
    );
  } else {
    pushHistory(args[0]);

    const output = await bin[args[0]](args.slice(1));
    setHistory(output);
  }

  setCommand('');
};
