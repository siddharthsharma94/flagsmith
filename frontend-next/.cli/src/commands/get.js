const { Command, flags } = require('@oclif/command');
const cli = require('cli-ux').default;
const getPrefix = require('../helpers/getPrefix');
const controller = require('../controller').writeGet;
const { execSync } = require('child_process');

class TheCommand extends Command {
    async run() {
        const { args } = this.parse(TheCommand);
        const action = args.prefix ? `GET_${args.prefix.toUpperCase()}` : await cli.prompt('Define action to retrieve the item', { default: 'GET_THING' });
        if (args.prefix) {
            console.log(`GET_${args.prefix.toUpperCase()}`);
        }
        const prefix = await cli.prompt('Where does it get stored in the reducer?', { default: getPrefix(action) });
        const api = await cli.prompt('What\'s the api path? ', { default: `/${getPrefix(action)}/:id` });
        const createProvider = await cli.prompt('Do you want to create a provider?', { default: 'yes' });
        const gitAdd = await cli.prompt('git add?', { default: 'yes' });
        await controller(action, prefix, api, createProvider === 'yes');
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
