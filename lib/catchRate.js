const config = require('../config.json');

module.exports = async (msg, pokemonName) => {
    const guildId = msg.channel.guild.id;    
    const guild = await db.models.guilds.getByGuildId(guildId);

    let rate = config.catching.defaultRate;

    if(guild && guild.rate >= 0 && guild.rate <= 100) {
        rate = guild.rate;
    }

    if(config.catching.priority.indexOf(pokemonName) != -1 || config.catching.priority.indexOf("*") != -1) {
        rate = 100;
    }

    const random = Math.floor(Math.random() * (100 - 0) ) + 0;

    console.log("Randomized number: " + random + " of " + rate + "/100 for pokemon " + pokemonName);

    if(random < rate) {
        return true;
    }

    return false;
}