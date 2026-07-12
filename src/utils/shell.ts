import React from 'react';
import * as bin from './bin';

// Braille frames that read as a single-cell grid of dots appearing to spin.
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// Commands that fetch from a remote API and may take a moment to respond.
const asyncCommands = ['quote', 'readme'];

export const shell = async (
  command: string,
  setHistory: (value: string) => void,
  updateHistory: (index: number, value: string) => void,
  clearHistory: () => void,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
  historyIndex: number,
) => {
  const args = command.split(' ');
  args[0] = args[0].toLowerCase();

  if (args[0] === 'clear') {
    clearHistory();
    setCommand('');
  } else if (command === '') {
    setHistory('');
    setCommand('');
  } else if (Object.keys(bin).indexOf(args[0]) === -1) {
    setHistory(
      `
shell: command not found: ${args[0]}. Try 'help' to get started.`,
    );
    setCommand('');
  } else if (asyncCommands.includes(args[0])) {
    // Show a spinner and clear the prompt so the user can keep working while
    // the request is in flight. The output lands in its own history entry, so
    // running other commands meanwhile won't clobber it.
    let frame = 0;
    setHistory(spinnerFrames[frame]);
    setCommand('');
    const spinner = setInterval(() => {
      frame = (frame + 1) % spinnerFrames.length;
      updateHistory(historyIndex, spinnerFrames[frame]);
    }, 80);

    try {
      const output = await bin[args[0]](args.slice(1));
      updateHistory(historyIndex, output);
    } finally {
      clearInterval(spinner);
    }
  } else {
    const output = await bin[args[0]](args.slice(1));
    setHistory(output);
    setCommand('');
  }
};
