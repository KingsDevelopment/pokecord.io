const showHelp = require('../showHelp');
const prefix = require('../prefix');

const config = require('../../config.json');

exports.command = 'pokedex [suffix]';
exports.describe = "Show bot's pokedex";
exports.builder = {};
exports.handler = async (argv) => {
    if(argv.suffix === 'help') {
        return showHelp(argv);
    }

    const suffix = argv.msg.content.replace(config.commandPrefix, '').replace(argv._[0], '');
    const serverPrefix = await prefix(argv.msg);
    argv.msg.channel.send(serverPrefix + "pokedex " + (suffix ? suffix : ""));
    return
};