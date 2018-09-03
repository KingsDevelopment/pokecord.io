const needle = require('needle');
const htmlToText = require('html-to-text');
const config = require('../config.json');

const { RichEmbed } = require('discord.js');

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

const run = async () => {
    const clientChannels = client.channels;
    
    const channels = db.models.channels;
    const spamChannels = await channels.spam();

    const filtered = clientChannels
                    .filter(channel => 
                        (channel.type === "text" && spamChannels.indexOf(channel.id) >= 0));

    const quote = await getQuote();
    filtered.map(channel => {
        channel.send(quote);
    });

    const max = config.delay.spam.max;
    const min = config.delay.spam.min;
    const delay = Math.floor(Math.random() * (max - min) ) + min;
    client.setTimeout(run, delay);
}

module.exports = run;