const config = require('../config.json');

module.exports = (msg, pokemonName) => {
    const serverId = msg.channel.guild.systemChannelID;
    let rate = config.catchRate[serverId];

    if(config.priority.indexOf(pokemonName) != -1 || config.priority.indexOf("*") != -1) {
        rate = 100;
    }

    const random = Math.floor(Math.random() * (100 - 0) ) + 0;

    console.log("Randomized number: " + random + " of " + rate + "/100 for pokemon " + pokemonName);

    if(random < rate) {
        return true;
    }

    return false;
}