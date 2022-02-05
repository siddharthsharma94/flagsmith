const { Command, flags } = require('@oclif/command');
const cli = require('cli-ux').default;
const getPrefix = require('../helpers/getPrefix');
const controller = require('../controller').writeUpdate;
const swaggerToTS = require("@manifoldco/swagger-to-ts").default;
const request = require("request");
const _ = require('lodash')
const { exec, execSync } = require('child_process');
const reg = /\{(.*?)\}/g
const collectionController = require('../controller').writeCollection;
const getController = require('../controller').writeGet;
const updateController = require('../controller').writeUpdate;
const writeTypes = require('../helpers/writer').writeTypes;

class TheCommand extends Command {
  async run() {


    const uri = await cli.prompt('Where is the Swagger JSON?');
      await new Promise(async (resolve ,reject)=>{
          request.get(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              const swagger = JSON.parse(body);
              const output = swaggerToTS(swagger); // Outputs TypeScript defs as a string (to be parsed, or written to a file)
              writeTypes(output)
              const v = parseInt(swagger.swagger||swagger.openapi);
            }
          });
      })
  }
}
TheCommand.args = [
  { name: 'prefix' },
];
TheCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = TheCommand;
