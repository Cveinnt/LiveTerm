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
  const regExpExecArray = /!(-?)(?:(\d+)|!)/.exec(input);
  if (regExpExecArray) {
    const isMinus =
      Boolean(regExpExecArray[1]) && regExpExecArray[1].length > 0;

    /**
     * either digits or '!'
     */
    const n = regExpExecArray[2];
    const index = parseInt(n);
    if (Number.isNaN(index)) {
      command = getLast();
    } else {
      /**
       * !0, !-0 are invalid
       */
      if (index > 0) {
        if (isMinus) {
          command = getMinus(index);
        } else {
          command = get(index);
        }
      }
    }
  }

  return command;
}

function get(index: number): string {
  return history[index];
}

function getMinus(index: number): string {
  // '!!' is a synonym for '!-1' so + 1
  return history[historyIndex - index + 1];
}

function getLast(): string {
  return history[historyIndex];
}
