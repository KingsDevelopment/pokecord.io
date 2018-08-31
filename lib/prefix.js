const config = require('../config.json');

module.exports = (msg) => {
    const serverId = msg.channel.guild.id;
    return config.prefixes[serverId] ? config.prefixes[serverId] : 'p!';
}