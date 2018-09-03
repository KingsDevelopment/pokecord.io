const config = require('../config.json');

const resemble = require('./resemble');
const prefix = require('./prefix');
const catchRate = require('./catchRate');

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
    if(msg.author.id === config.pokecordBotId && msg.embeds.length) {
        const embed = msg.embeds[0];
        if(embed.title.indexOf("A wild pokémon has appeared!") != -1) {
            console.log("Wild pokemon appeared, try catching.");
            let start = Date.now();
        
            //debug
            const pokemon = await resemble.resemble(embed.image.url);

            if(pokemon) {
		        console.log("Pokemon found: " + pokemon);
            }

            const allowed = await catchRate(msg, pokemon);
            if(pokemon && allowed) {
                const delayTime = await delay();

                const serverPrefix = await prefix(msg);
                msg.channel.send(serverPrefix + "catch " + pokemon);
                
                let finished = Date.now();
    
                let speedMessage = "Catching pokemon " + pokemon + " took: " + (finished-start) + "ms (" + delayTime + "ms delay)";
                console.log(speedMessage);
            }
        }
    }
}