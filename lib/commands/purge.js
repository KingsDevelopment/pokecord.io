const syncer = require('../syncer');
const purge = require('../purge');
const showHelp = require('../showHelp');

exports.command = 'purge [command]';
exports.describe = "Purge pokemons by type";
exports.builder = {
    iv: {
        alias: 'i',
        default: 100,
        describe: 'The max iv of purge-able pokemons',
        type: 'number'
    },
    level: {
        alias: 'l',
        default: 100,
        describe: 'The max level a pokemon can be',
        type: 'number'
    },
    dupes: {
        alias: 'd',
        default: true,
        describe: 'Only purge dupes.',
        type: 'boolean'
    },
    skipPriorities: {
        alias: 'p',
        default: true,
        describe: 'Skip priorities',
        type: 'boolean'
    },
    keepHighest: {
        alias: 'k',
        default: 'iv',
        describe: 'Keep highest iv or level.',
        type: 'string',
        choices: ['iv', 'level']
    }
};
exports.handler = async (argv) => {
    if(syncer.syncing) {
        argv.msg.reply("Syncer is syncing, please wait");
        return;
    }

    if(argv.command && argv.command === 'confirm') {
        return await purge.confirm(argv.msg);
    }
    
    if(argv.command && argv.command === 'help') {
        return showHelp(argv);
    }

    return await purge.add(argv.msg, argv.dupes, argv.level, argv.iv, argv.keepHighest, argv.skipPriorities);
};