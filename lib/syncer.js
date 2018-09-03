const config = require('../config.json');

const prefix = require('./prefix');

const unorm = require('unorm');
const _ = require('lodash');
const moment = require('moment');

const totalPokemon = 0;
const pageSize = 20;

let counter = 0;
let syncing = false;

const doSync = async (channel, page = 1) => {
    const serverPrefix = await prefix(null, channel.guild.id);
    channel.send(serverPrefix + "pokemon " + page);
}

const getChannel = async (argv) => {
    const channels = db.models.channels;
    const syncChannel = await channels.sync();
    
    if(!syncChannel && argv && argv.msg) {
        argv.msg.reply("No sync channel configured. Type: >channel <channel> sync");
        return;
    }

    const filtered = client.channels
                    .find(channel => 
                        (channel.type === "text" && syncChannel.channelId === channel.id));

    return filtered;
};

const sync = async (argv) => {
    const clientChannels = client.channels;

    if(syncing) {
        if(argv && argv.msg) {
            argv.msg.reply("I am already syncing, have patients.");
        }
        return;
    }

    const channel = await getChannel(argv);

    if(channel) {
        syncing = moment().toISOString();
        doSync(channel, 1);
    }
};

const getFooterData = (footer) => {
    const matches = footer.text.match(/^Showing ([0-9]*)\-([0-9]*) of ([0-9]*) pokémon/);

    if(!matches || !matches.length || matches.length < 3) {
        return false;
    }

    return {
        start: parseInt(matches[1]),
        end: parseInt(matches[2]),
        total: parseInt(matches[3])
    }
};

const getPokemons = (description) => {
    const splitted = description.split('\n');
    
    const pokemons = splitted.map(line => {
        const regex = /\*\*(.*)\*\* \| Level: ([0-9]*) \| Number: ([0-9]*) \| IV: ([0-9]*.[0-9]*)%/;
        const matches = line.match(regex);
        if(!matches || !matches.length || matches.length != 5) {
            return null;
        }

		let pokemonName = unorm.nfd(matches[1].toLowerCase());
		pokemonName = pokemonName.toLowerCase().replace(/[^a-zA-Z0-9 ]+/g, "");
        return {
            name: pokemonName,
            level: parseInt(matches[2]),
            number: parseInt(matches[3]),
            IV: parseFloat(matches[4])
        };
    });

    return _.sortBy(pokemons, 'number');
}

checkPokemonList = async (embed) => {
    const data = getFooterData(embed.footer);
    if(!data) {
        console.log("Something wen't wrong with footer data: ", embed.footer.text);
        return;
    }

    const currentPage = data.end/pageSize;
    
    const pokemons = getPokemons(embed.description);

    const Pokemons = db.models.pokemons;
    
    for(let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];

        const exists = await Pokemons.findOne({
            number: pokemon.number
        });
        

        let create = true;
        if(exists) {
            if(exists.name !== pokemon.name) {
                await Pokemons.deleteById(exists._id);
            }
            else {
                create = false;
            }
        }

        if(create) {
            pokemon.lastSynced = syncing;
            await Pokemons.create(pokemon);
        }
    }

    if(data.end < data.total) {
        const channel = await getChannel();
        client.setTimeout(() => doSync(channel, (currentPage + 1)), 2000);
        return;
    }
    
    await Pokemons.delete({
        $or: [
            { number: { $gt: data.total }},
            { lastSyned: { $lt: syncing }}

        ]
    });
    syncing = false;

    client.setTimeout(() => sync(), config.delay.sync);
    return;
}

const onMessage = (msg) => {
    if(msg.author.id === config.pokecordBotId && msg.embeds.length) {
        const embed = msg.embeds[0];
        if(embed.title.indexOf("Your pokémon:") != -1) {
            return checkPokemonList(embed);
        }
    }
}

module.exports = {
    init: () => {
        if(config.autoSync) {
            syncing = false;
            sync();
        }
    },
    sync: sync,
    onMessage: onMessage,
    syncing: syncing
};