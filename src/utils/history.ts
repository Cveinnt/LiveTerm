type History = Record<number, string>;
const history: History = {};
let historyIndex = 0;

export function list(): string {
  const maximumNumberOfDigits = historyIndex.toString().length;

  const array: Array<string> = [];
  for (const index in history) {
    const value = history[index];
    const paddedIndex = index.toString().padStart(maximumNumberOfDigits, ' ');

    array.push(`${paddedIndex}:  ${value}`);
  }

  return array.join('\n');
}

export function push(command: string): History {
  if (getLast() !== command) {
    history[++historyIndex] = command;
  }

  return history;
}

export function getCommandIfHistoryExpansion(input): string {
  let command = undefined;
  const regExpExecArray = /!(?:(\d+)|!)/.exec(input);
  if (regExpExecArray) {
    const index = regExpExecArray[1];
    if (index === '!') {
      command = getLast();
    } else {
      // parseInt here is guaranteed to succeed I suppose.
      command = get(parseInt(index));
    }
  }

  return command;
}

function get(index: number): string {
  return history[index];
}

function getLast(): string {
  return history[historyIndex];
}
