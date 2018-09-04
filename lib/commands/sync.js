const syncer = require('../syncer');
const showHelp = require('../showHelp');

exports.command = 'sync [suffix]';
exports.describe = "Start synchronizing pokemons to the database.";
exports.builder = {};
exports.handler = async (argv) => {
    if(argv.suffix === 'help') {
        return showHelp(argv);
    }

    return syncer.sync(argv);
};