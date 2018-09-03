const config = require('../config.json');

const prefix = require('./prefix');
const delay = require('./delay');

const _ = require('lodash');

const purges = [];

const getChannel = async (msg) => {
    const channels = db.models.channels;
    const syncChannel = await channels.sync();
    
    if(!syncChannel && msg) {
        argv.msg.reply("No sync channel configured. Type: >channel <channel> sync");
        return;
    }

    const filtered = client.channels
                    .find(channel => 
                        (channel.type === "text" && syncChannel.channelId === channel.id));

    return filtered;
};

const getAll = async (dupes, maxLevel, maxIV, keepHighest, skipPriorities) => {
    const Pokemons = db.models.pokemons;
    const aggregation = [{
        $group: {
            _id: "$name",
            data: {
                $addToSet: {
                    _id: "$_id",
                    level: "$level",
                    IV: "$IV"
                }
            },
            count: {
                $sum: 1
            }
        }
    }];

    if(dupes) {
        aggregation.push({
            $match: {
                count: { $gt: 1 }
            }
        });
    }

    let all = await Pokemons.aggregate(aggregation);
    return filterPokemon(all, dupes, maxLevel, maxIV, keepHighest, skipPriorities);
}

const filterPokemon = (all, dupes = true, maxLevel = false, maxIV = false, keepHighest = 'iv', skipPriorities = true) => {
    // console.log(all);
    const pokemons = [];
    for(let i = 0; i < all.length; i++) {
        const pokemon = all[i];
        const name = pokemon._id;

        if(skipPriorities && config.catching.priority.indexOf(name) >= 0) {
            continue;
        }

        let data = pokemon.data;
        if(dupes) {
            data = _.orderBy(data, [keepHighest], ['desc']);
            data.shift();
        }

        data = _.filter(data, p => {
            if((maxIV && p.IV > maxIV) || (maxLevel && p.level > maxLevel)) {
                return false;
            }

            return true;
        });
    
        for(let j = 0; j < data.length; j++) {
            const toPush = data[j];
            toPush.name = name;

            pokemons.push(toPush);
        }
    }

    return _.orderBy(pokemons, ['number'], ['desc']);
};

const add = async (msg, dupes, maxLevel, maxIV, keepHighest, skipPriorities) => {
    const syncChannel = await getChannel(msg);

    if(!syncChannel) {
        return;
    }

    const all = await getAll(dupes, maxLevel, maxIV, keepHighest, skipPriorities);
    
    let optionsString = `**Purge options:**
Dupes-only: ` + dupes + ` | Keep highest: **` + keepHighest + `** | Skip priorities: **` + skipPriorities + `** | Max IV: ` + maxIV + ` | Max Level: ` + maxLevel;

    if(all.length) {
        const onGoingIndex = _.findIndex(purges, { authorId: msg.author.id });
        if(onGoingIndex >= 0) {
            client.clearTimeout(purges[onGoingIndex].cancelTimeout);
            purges.splice(onGoingIndex, 1);
            msg.reply("Removed old purge criteria.");
        }

        purges.push({
            options: {
                dupes: dupes,
                maxLevel: maxLevel,
                maxIV: maxIV,
                keepHighest: keepHighest,
                skipPriorities: skipPriorities
            },
            authorId: msg.author.id,
            cancelTimeout: client.setTimeout(() => cancel(msg), 20000)
        });
        
        optionsString += `
Pokemon count: **` + all.length + `**\n
Type \`` + config.commandPrefix + `purge confirm\` within 20 seconds to confirm the purge.`
    }
    else {
        
        optionsString += `
**No pokemon found with the criteria.**`
    }

    return msg.reply(optionsString);
};

const confirm = (msg) => {
    const onGoingIndex = _.findIndex(purges, { authorId: msg.author.id });
    if(onGoingIndex >= 0) {
        client.clearTimeout(purges[onGoingIndex].cancelTimeout);
        return purge(msg, purges[onGoingIndex].options);
    }
};

const cancel = (msg) => {
    const onGoingIndex = _.findIndex(purges, { authorId: msg.author.id });
    if(onGoingIndex >= 0) {
        client.clearTimeout(purges[onGoingIndex].cancelTimeout);
        purges.splice(onGoingIndex, 1);
        msg.reply("I cancelled your purge request.");
    }
};

const purge = async (msg, options) => {
    const all = await getAll(options.dupes, options.maxLevel, options.maxIV, options.keepHighest, options.skipPriorities);

    const serverPrefix = await prefix(msg);

    const syncChannel = await getChannel(msg);

    if(!syncChannel) {
        return;
    }
    
    msg.reply("Started purging in sync channel!");

    let ids = [];
    let numbers = [];
    let count = 0;
    
    const Pokemons = db.models.pokemons;
    for(let i = 0; i < all.length; i++) {
        let pokemon = all[i];

        ids.push(pokemon._id);
        numbers.push(pokemon.number);
        count++;

        if(count === 50) {
            syncChannel.send(serverPrefix + "release " + numbers.join(" "));
            await delay(2000);
            syncChannel.send(serverPrefix + "confirm");
            await delay(2000);
            await Pokemons.delete({
                _id: { $in: ids }
            });
            ids = [];
            numbers = [];
            count = 0;
        }
    }
    
    msg.reply("Done purging!");
};

module.exports = {
    add: add,
    confirm: confirm,
    cancel: cancel,
    purge: purge
};