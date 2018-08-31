const Discord = require('discord.js');
const config = require('../config.json');

const commands = require('./commands');
const catcher = require('./catcher');

let client;

const onMessage = async (msg) => {
    if(msg.content.indexOf(config.commandPrefix) === 0) {
        if(msg.author.id !== config.admin) {
            msg.reply("I don't listen to you fagg");
            return;
        }

        return commands(client, msg);
    }
    else if(config.channels.indexOf(msg.channel.id) != -1) { 
        return catcher(msg);   
    }
};

module.exports = async () => {
    client = new Discord.Client();

    client.on('ready', () => {
        client.user.setActivity("Pokecord!")
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', onMessage);

    client.login(config.discordToken);
}