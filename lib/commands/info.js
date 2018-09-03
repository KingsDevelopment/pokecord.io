const packageJson = require('../../package.json');

const { RichEmbed } = require('discord.js');

const toHHMMSS = (string) => {
    var sec_num = parseInt(string, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

exports.command = 'info';
exports.describe = "Get information about the bot.";
exports.builder = {};
exports.handler = async (argv) => {
    const uptime = toHHMMSS(process.uptime());
    
    const models = db.models;

    const channels = await models.channels.find();
    const guilds = await models.guilds.find();
    const pokemons = await models.pokemons.find();

    const clientUser = client.user;
    const ping = client.ping;
    
    const description = `**ID:** ` + clientUser.id + `
**Username:** ` + clientUser.username + `#` + clientUser.discriminator + `
**Uptime:** ` + uptime + `
**Ping:** ` + ping + `ms
**Version:** ` + packageJson.version + `\n
**Configured Channels:** ` + channels.length + `
**Configured Servers:** ` + guilds.length + `
**Synchronized pokemons:** ` + pokemons.length;

    const embed = new RichEmbed()
    .setTitle('Pokecord bot info')
    .setFooter('Pokecord bot created with ♥ by https://kings-dev.io')
    .setDescription(description)
    .setThumbnail(clientUser.avatarURL);

    return argv.msg.channel.send(embed);
};