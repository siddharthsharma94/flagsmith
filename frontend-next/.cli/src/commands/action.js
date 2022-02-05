const { Command, flags } = require('@oclif/command');
const cli = require('cli-ux').default;
const getPrefix = require('../helpers/getPrefix');
const controller = require('../controller').writeAction;
const { execSync } = require('child_process');

class TheCommand extends Command {
  async run() {
    const { args } = this.parse(TheCommand);
    const action = args.prefix ? `${args.prefix.toUpperCase()}` : await cli.prompt('Define action to retrieve the collection', { default: 'DO_THING' });
    if (args.prefix) {
      console.log(`${args.prefix.toUpperCase()}`);
    }
    const prefix = await cli.prompt('Where does it get stored in the reducer?', { default: getPrefix(action) });
    const gitAdd = await cli.prompt('git add?', { default: 'no' });

    await controller(action, prefix);

    if(gitAdd !== 'no') {
      execSync('cd ../ && git add .');
    }
    execSync('cd ../ && npm run lint:fix');
  }
}
TheCommand.args = [
  { name: 'prefix' },
];
TheCommand.description = `Writes the app actions, saga
...
Extra documentation goes here
`;

TheCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = TheCommand;
