const config = require('../config.json');

module.exports = async (msg, guildId) => {
    const serverId = guildId ? guildId : msg.channel.guild.id;
    
    let prefix = "p!";
    
    const guilds = db.models.guilds;
    const guild = await guilds.getByGuildId(serverId);

    if(guild) {
        prefix = guild.prefix;
    }
    
    return prefix;
}