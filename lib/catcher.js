const config = require('../config.json');

const resemble = require('./resemble');
const prefix = require('./prefix');

const pokecordBotId = "365975655608745985";

const delay = () => {
    return new Promise((resolve, reject) => {
        if(!config.delay.enabled) {
            return resolve();
        }

        const max = config.delay.max;
        const min = config.delay.min;
        const delay = Math.floor(Math.random() * (max - min) ) + min;
        setTimeout(() => resolve(delay), delay);
    });
};

module.exports = async (msg) => {
    if(msg.author.id === pokecordBotId && msg.embeds.length) {
        const embed = msg.embeds[0];
        if(embed.title.indexOf("A wild pokémon has appeared!") != -1) {
            console.log("Wild pokemon appeared, try catching.");
            let start = Date.now();
        
            //debug
            const pokemon = await resemble(embed.image.url)
            
            const delayTime = await delay();
            msg.channel.send(prefix(msg) + "catch " + pokemon);
            
            let finished = Date.now();

            let speedMessage = "Catching pokemon " + pokemon + " took: " + (finished-start) + "ms (" + delayTime + "ms delay)";
            console.log(speedMessage);

            if(msg.channel.id === config.debugChannel) {
                msg.channel.send(speedMessage);
                msg.channel.send(prefix(msg) + "info latest");
            }
        }
    }
}