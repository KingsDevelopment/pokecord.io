const syncer = require('../syncer');
const showHelp = require('../showHelp');

exports.command = 'sync [suffix]';
exports.describe = "Start synchronizing pokemons to the database.";
exports.builder = {};
exports.handler = async (argv) => {
    console.log(argv.suffix);
    if(argv.suffix === 'help') {
        return showHelp(argv);
    }

    argv.msg.reply("Started syncing in sync channel!");
    return syncer.sync(argv);
};