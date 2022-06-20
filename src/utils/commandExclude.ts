import config from '../../config.json';

var exception_commands = [ 'banner' , 'help' ]

export const commandExclude = (command: string) => {
  return config.excluded_commands.includes(command) && !(exception_commands.includes(command))
}
