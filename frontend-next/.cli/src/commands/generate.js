const { Command, flags } = require('@oclif/command');
const cli = require('cli-ux').default;
const getPrefix = require('../helpers/getPrefix');
const collectionController = require('../controller').writeCollection;
const getController = require('../controller').writeGet;
const updateController = require('../controller').writeUpdate;
const postController = require('../controller').writePost;
const data = require('../../../tests/pact/tests/test.pact');
const each = require('lodash/each');
const { exec } = require('child_process');

class TheCommand extends Command {
    async run() {
        each(data, async (item) => {
            if (item.path) {
                const prefix = item.prefix || item.path.split('/')[1];
                if (item.get) {
                    if (Array.isArray(item.get.body(r => r))) {
                        await collectionController(`GET_${prefix.toUpperCase()}`, prefix, item.path, true);
                    } else {
                        await getController(`GET_${prefix.toUpperCase()}`, prefix, item.path, true);
                    }
                }
                if (item.put) {
                    await updateController(`UPDATE_${prefix.toUpperCase()}`, prefix, item.path, true);
                }
                if (item.post) {
                    await postController(`CREATE_${prefix.toUpperCase()}`, prefix, item.path, true);
                }
            }
        });
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
