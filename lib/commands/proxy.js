const prefix = require('../prefix');
const showHelp = require('../showHelp');

const config = require('../../config.json');

exports.command = 'proxy [pokecord] [parameters]';
exports.describe = "Show bot's pokemon";
exports.builder = {};
exports.handler = async (argv) => {
    if(argv.suffix === 'help') {
        return showHelp(argv);
    }

    const command = argv.msg.content.replace(config.commandPrefix, '').replace(argv._[0], '').replace(' ', '');
    const serverPrefix = await prefix(argv.msg);

    if(!command) {
        return argv.msg.reply("Please provide a command to proxy.");
    }

    argv.msg.channel.send(serverPrefix + command);
    return
};