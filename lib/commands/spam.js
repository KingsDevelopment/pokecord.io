const _ = require('lodash');
const needle = require('needle');
const htmlToText = require('html-to-text')
const config = require('../../config.json');

const { RichEmbed } = require('discord.js');

let enabled = false;

const getQuote = async () => {
    const url = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=";
    
    const res = await needle('GET', url);
    const resBody = res.body[0];
    
    const quote = htmlToText.fromString(resBody.content, {
        wordwrap: 130
    });

    return new RichEmbed()
    .setDescription(quote);
}

const spam = async (client, msg) => {
    if(enabled) {
        const channels = client.channels;
        const spamChannel = channels.find(channel => (channel.type === "text" && channel.id === config.spamChannel[msg.channel.guild.id]));

        if(spamChannel) {
            const quote = await getQuote();
            spamChannel.send(quote);

            const max = config.delay.spam.max;
            const min = config.delay.spam.min;
            const delay = Math.floor(Math.random() * (max - min) ) + min;
            setTimeout(() => spam(client, msg), delay);
        }
        else {
            enabled = false;
            msg.reply("This server has no spam channel configured.");
        }
    }
    return enabled;
}

const start = async (client, msg) => {
    enabled = true;
    return spam(client, msg);
}

module.exports = async (client, msg) => {
    if(enabled) {
        enabled = false;
        msg.reply("I stopped spamming!");
    }
    else {
        enabled = await start(client, msg);

        if (enabled) {
            msg.reply("I started spamming!");
        }
    }

    return enabled;
};