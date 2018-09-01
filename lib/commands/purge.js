const prefix = require('../prefix');
const syncer = require('../syncer');

const types = ["iv", "all"];


const delay = (delay) => new Promise((resolve, reject) => client.setTimeout(resolve, delay));

exports.command = 'purge <type> [iv]';
exports.describe = "Purge pokemons by type";
exports.builder = {};
exports.handler = async (argv) => {

    if(types.indexOf(argv.type) === -1) {
        argv.msg.reply("Purge type " + argv.type + " is not possible. Use one of the following: " + types.join(", "));
        return;
    }

    if(argv.type === 'iv' && (!argv.iv || !parseInt(argv.iv) || parseInt(argv.iv) > 100 || parseInt(argv.iv) < 1)) {
        argv.msg.reply("IV must be between 1 & 100");
        return;
    }

    if(syncer.syncing) {
        argv.msg.reply("Syncer is syncing, please wait");
        return;
    }

    const Pokemons = db.models.pokemons;

    const all = await Pokemons.find();
    const serverPrefix = await prefix(argv.msg);

    let string = "";
    let count = 0;
    for(let i = 0; i < all.length; i++) {
        let pokemon = all[i];
        
        if(pokemon.level >= 90) {
            continue;
        }

        if(argv.type === 'iv') {
            if(pokemon.IV > parseInt(argv.iv)) {
                continue;
            }
        }

        string += pokemon.number + " ";
        count++;

        if(count === 50) {
            argv.msg.channel.send(serverPrefix + "release " + string);
            string = "";
            count = 0;
            await delay(5000);
            argv.msg.channel.send(serverPrefix + "confirm");
            await delay(2000);
        }
    }
    
    argv.msg.reply("Done purging!");
};