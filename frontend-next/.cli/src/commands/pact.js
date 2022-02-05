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
const parseBody = (like)=>like;
const { json2ts } = require('json-ts');

class TheCommand extends Command {
    async run() {
        const { args } = this.parse(TheCommand);

        const key = await cli.prompt('What is the root key?', { default: args.name || "foo" });

        if (!data[key]) {
            console.log("Could not find key in pact file")
            return
        }
        const method = await cli.prompt('What is the method?', { default: Object.keys(data[key])[1] });

        const isCollection = method === 'get'? await cli.prompt('is it a collection?', { default: "yes" }) : null;
        const item = data[key][method.toLowerCase()]
        if(!item) {
            console.log("Could not find this in the pact file, check the key and method exist in the pact file")
            return
        }
        const prefix = await cli.prompt('what is the prefix?', { default: item.prefix || data[key].path.split('/')[1] });

        if (method.toLowerCase()[0] === 'g') {
            if (isCollection) {
                await collectionController(`GET_${prefix.toUpperCase()}`, prefix, data[key].path, true);
            } else {
                await getController(`GET_${prefix.toUpperCase()}`, prefix, data[key].path, true);
            }
        }

        if (method.toLowerCase()[1] === 'u') {
            await updateController(`UPDATE_${prefix.toUpperCase()}`, prefix, data[key].path, true );
        }
        if (method.toLowerCase()[0] === 'o') {
            await postController(`CREATE_${prefix.toUpperCase()}`, prefix, data[key].path, true);
        }

        const res = item.body(parseBody);
        console.log("Generated types")
        console.log(json2ts(JSON.stringify(res)))

        exec('cd ../ && npm run lint:fix');
    }
}
TheCommand.args = [
    { name: 'name' },
];
TheCommand.description = `Writes the app actions, saga
...
Extra documentation goes here
`;

TheCommand.flags = {
    name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = TheCommand;
