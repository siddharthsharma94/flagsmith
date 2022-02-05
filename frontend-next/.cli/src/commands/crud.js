const { Command, flags } = require('@oclif/command');
const cli = require('cli-ux').default;
const getPrefix = require('../helpers/getPrefix');
const controller = require('../controller').writePost;
const controllerRead = require('../controller').writeGet;
const controllerUpdate = require('../controller').writeUpdate;
const controllerDelete = require('../controller').writeDelete;
const { exec } = require('child_process');

class TheCommand extends Command {
    async run() {
        const { args } = this.parse(TheCommand);
        const action = args.prefix ? args.prefix.toUpperCase() : await cli.prompt('Define action to crud the item (without get_)', { default: 'THING' });
        if (args.prefix) {
            console.log(`CRUD: ${args.prefix.toUpperCase()}`);
        }
        console.log(getPrefix(action));
        const prefix = await cli.prompt('Where does it get stored in the reducer?', { default: getPrefix(`CREATE_${action}`) });
        const api = await cli.prompt('What\'s the api path? ', { default: `/${getPrefix(`A_${action}`)}/:id` });
        const apiPost = await cli.prompt('What\'s the api path to post? ', { default: `/${getPrefix(`A_${action}`)}` });
        const createProvider = await cli.prompt('Do you want to create a provider?', { default: 'yes' });
        const gitAdd = await cli.prompt('git add?', { default: 'yes' });
        await controllerDelete(`DELETE_${action}`, prefix, api, createProvider === 'yes');
        await controller(`CREATE_${action}`, prefix, apiPost, createProvider === 'yes', 'any', true);
        await controllerRead(`GET_${action}`, prefix, api, createProvider === 'yes');
        await controllerUpdate(`UPDATE_${action}`, prefix, api, createProvider === 'yes');

        if(gitAdd === 'yes') {
            exec('cd ../ && git add .');
        }
        exec('cd ../ && npm run lint:fix');
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
