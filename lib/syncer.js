const config = require('../config.json');

const prefix = require('./prefix');
const delay = require('./delay');
const notifier = require('./notifier');

const unorm = require('unorm');
const _ = require('lodash');
const moment = require('moment');

const totalPokemon = 0;
const pageSize = 20;

let counter = 0;
let syncing = false;

const doSync = async (page = 1, channel = false, serverPrefix = false) => {
    if(!channel) {
        channel = await getChannel();
    }

    if(!serverPrefix) {
        serverPrefix = await prefix(null, channel.guild.id);
    }

    if(!syncing) {
        syncing = moment().toISOString();
    }

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

    if(!config.sync.enabled) {
        if(argv && argv.msg) {
            argv.msg.reply("Syncing is disabled in the config.");
        }
        return;
    }

    if(syncing) {
        if(argv && argv.msg) {
            argv.msg.reply("I am already syncing, have patients.");
        }
        return;
    }
    else {
        if(argv && argv.msg) {
            argv.msg.reply("Started syncing in sync channel!");
        }
    }

    const channel = await getChannel(argv);

    if(channel) {
        serverPrefix = await prefix(null, channel.guild.id);
        channel.send(serverPrefix + "order number");
        await delay(2000);
        doSync(1, channel, serverPrefix);
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
		pokemonName = pokemonName.toLowerCase();
        return {
            name: pokemonName,
            level: parseInt(matches[2]),
            number: parseInt(matches[3]),
            IV: parseFloat(matches[4])
        };
    });

    return _.sortBy(pokemons, 'number');
}

const checkPokemon = async (pokemon, notify = false) => {
    const Pokemons = db.models.pokemons;
    const exists = await Pokemons.findOne({
        number: pokemon.number
    });
    
    let create = true;
    let isNew = true;
    if(exists) {
        isNew = false;

        if(exists.name !== pokemon.name) {
            await Pokemons.deleteById(exists._id);
        }
        else {
            create = false;
        }
    }

    if(create) {
        pokemon.lastSynced = syncing ? syncing : moment().toISOString();
        await Pokemons.create(pokemon);

        pokemon.isNew = isNew;
        if(notify) {
            await notifier(pokemon);
        }
    }

    return create;
}

checkPokemonList = async (embed) => {
    const data = getFooterData(embed.footer);
    if(!data) {
        console.log("Something wen't wrong with footer data: ", embed.footer.text);
        return;
    }

    const currentPage = data.end/pageSize;
    
    const pokemons = getPokemons(embed.description);
    
    for(let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];

        await checkPokemon(pokemon);
    }

    if(data.end < data.total) {
        client.setTimeout(() => doSync((currentPage + 1)), 2500);
        return;
    }
    
    await Pokemons.delete({
        lastSyned: { $lt: syncing }
    });
    
    const channel = await getChannel();
    channel.send("Next sync in " + config.sync.interval/1000 + "s");
    syncing = false;
    client.setTimeout(() => sync(), config.sync.interval);
    return;
}

const checkSinglePokemon = async (embed, channel) => {
    const pokemon = {};

    const footerRegex = /(\d+)/;
    let matches = embed.footer.text.match(footerRegex);
    
    if(!matches || !matches[1] || isNaN(parseInt(matches[1]))) {
        return;
    }

    pokemon.number = parseInt(matches[1]);

    const titleRegex = /(\d+) (.*)/;
    matches = embed.title.match(titleRegex);
    
    if(embed.title.indexOf(':star:') === 0) {
        pokemon.shiny = true;
    }

    if(!matches || !matches[1] || isNaN(parseInt(matches[1]))) {
        return;
    }

    pokemon.level = parseInt(matches[1]);
    let pokemonName = unorm.nfd(matches[2].toLowerCase());
    pokemon.name = pokemonName.toLowerCase();
        

    const descriptionRegex = /\*\*Total IV \%\:\*\* (\d+)\.(\d+)\%/;
    matches = embed.description.match(descriptionRegex, "mi");

    if(!matches || !matches[1] || !matches[2] || isNaN(parseInt(matches[1])) || isNaN(parseInt(matches[2]))) {
        return;
    }

    pokemon.IV = parseFloat(matches[1] + "." + matches[2]);
    
    await checkPokemon(pokemon, true);

    channel.send("Synchronised " + pokemon.name);
}

const onMessage = async (msg) => {

    if(msg.author.id === config.pokecordBotId && msg.embeds.length) {
        const channel = await getChannel();

        if(channel.id === msg.channel.id) {
            const embed = msg.embeds[0];
            if(embed.title.indexOf("Your pokémon:") != -1) {
                return checkPokemonList(embed);
            }
            else if(embed.title.indexOf("Level ") >= 0) {
                return checkSinglePokemon(embed, channel);
            } 
        }
    }
};

const latest = async () => {
    const channel = await getChannel();
    client.setTimeout(async () => {
        const serverPrefix = await prefix(null, channel.guild.id);
        channel.send(serverPrefix + "info latest");
    }, 2000);
};

module.exports = {
    init: () => {
        if(config.sync.enabled && config.sync.onBoot) {
            syncing = false;
            sync();
        }
    },
    sync: sync,
    onMessage: onMessage,
    syncing: syncing,
    latest: latest
};