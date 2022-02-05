const { Command, flags } = require('@oclif/command');
const cli = require('cli-ux').default;
const getPrefix = require('../helpers/getPrefix');
const controller = require('../controller').writeScreen;
const { execSync } = require('child_process');

class TheCommand extends Command {
    async run() {
        const { args } = this.parse(TheCommand);
        const name = await cli.prompt('What is the screen called?', { default: args.name || "TheScreen" });
        const suggestion = name.split(/(?=[A-Z])/).join("-").toLowerCase().replace("-screen","")
        const path = await cli.prompt('What is the path?', { default: `/${suggestion}` });
        const gitAdd = await cli.prompt('git add?', { default: 'yes' });

        await controller(name,path,name);
        if(gitAdd !== 'no') {
            execSync('cd ../ && git add .');
        }
    }
}
TheCommand.args = [
    { name: 'name' },
];
TheCommand.flags = {
    name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = TheCommand;
