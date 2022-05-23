type History = Record<string, string>;
const history: History = {};
let historyIndex = 0;

export function list(): string {
  const array: Array<string> = [];
  for (const key in history) {
    const value: string = history[key];
    array.push(`${key}:  ${value}`);
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
      command = get(index);
    }
  }

  return command;
}

function get(index: string): string {
  return history[index];
}

function getLast(): string {
  return history[historyIndex];
}
