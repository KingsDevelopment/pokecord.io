const config = require('../config.json');

const showHelp = require('./showHelp');

const parser = require('yargs')
.commandDir('commands')
.usage("Usage: " + config.commandPrefix + '[command]')
.exitProcess(false)
.help('help')
.version(false)
.epilogue('Pokecord bot created with ♥ by https://kings-dev.io');

module.exports = async (msg) => {
    const Users = db.models.users;

    const currentUser = await Users.findByAuthorId(msg.author.id);
    
    if(!currentUser || currentUser.roles.indexOf('admin') === -1) {
        return;
    }

    const content = msg.content.replace(config.commandPrefix, '');

    if(content.indexOf('help') === 0) {
        return parser.showHelp((arg1, arg2, arg3) => {
            msg.reply(arg1)
            console.log(arg1, arg2,arg3)
        });
    }

    const args = parser.parse(content, {
        msg: msg,
        parser: parser
    }, (err, argv, output) => {
        if(output.length) {
            argv.msg.reply(output);
        }
    });
}