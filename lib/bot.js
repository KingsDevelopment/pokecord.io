const Discord = require('discord.js');
const config = require('../config.json');

const setup = require('./setup');


module.exports = async () => {
    global.client = new Discord.Client();

    client.on('ready', async () => {
        client.user.setActivity("Pokecord!")
        console.log(`Logged in as ${client.user.tag}!`);

        await setup();
    });

    client.login(config.discordToken);
}