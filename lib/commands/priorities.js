const config = require('../../config.json');

const showHelp = require('../showHelp');

const { RichEmbed } = require('discord.js');

const formatPokemon = (data) => {
    const strings = [];
    for(let i = 0; i < data.length; i++) {
        const pokemon = data[i];
        
        let name = pokemon.name;
        name = name.replace(name[0], name[0].toUpperCase());
        strings.push('**' + name + '** | Level: ' + pokemon.level + ' | Number: ' + pokemon.number + ' | IV: ' + pokemon.IV + '%');
    }

    return strings.join('\n');
};

exports.command = 'priorities [suffix]';
exports.describe = "List priorities & their information.";
exports.builder = {};
exports.handler = async (argv) => {
    if(argv.suffix === 'help') {
        return showHelp(argv);
    }

    const Pokemons = db.models.pokemons;
    
    const priorityList = config.catching.priority;

    const found = {};
    const notFound = [];

    for(let i = 0; i < priorityList.length; i++) {
        const pokemon = await Pokemons.find({
            name: priorityList[i]
        });
        
        if(pokemon.length) {
            found[priorityList[i]] = pokemon;
        }
        else {
            notFound.push(priorityList[i]);
        }
    }

    const foundNames = Object.keys(found);
    for(let i = 0; i < foundNames.length; i++) {
        const name = foundNames[i];
        const foundEmbed = new RichEmbed()
        .setTitle(name.replace(name[0], name[0].toUpperCase()))
        .setDescription(formatPokemon(found[name]));

        argv.msg.channel.send(foundEmbed);
        
    }
    
    const notFoundEmbed = new RichEmbed()
    .setTitle("Not found:")
    .setDescription(notFound.join(", "));

    argv.msg.channel.send(notFoundEmbed);
};