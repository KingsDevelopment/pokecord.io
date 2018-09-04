const config = require('../config.json');

const PushBullet = require('pushbullet');
const _ = require('lodash');

let pusher;

if(config.notifier.pushbullet.apiKey.length) {
    pusher = new PushBullet(config.notifier.pushbullet.apiKey);
}

module.exports = async (pokemon) => {
    if(pusher) {
        const devices = await pusher.devices();
        let device = _.find(devices.devices, device => device.nickname === config.notifier.pushbullet.nickname);

        if(!device) {
            device = await pusher.createDevice({
                nickname: config.notifier.pushbullet.nickname
            });
        }

        let send = false;
        if(pokemon.shiny && config.notifier.enabled.shiny) {
            send = true;
        }
        
        if(!send && config.notifier.enabled.priority && config.catching.priority.indexOf(pokemon.name) >= 0) {
            send = true;
        }
        
        if(!send && config.notifier.enabled.new && pokemon.isNew) {
            send = true;
        }
        
        if(!send && config.notifier.enabled.all) {
            send = true;
        }
        
        if(send) {
            const body = `# | Name | Level | IV
` + pokemon.number + ` | ` + pokemon.name + ` | ` + pokemon.level + ` | ` + pokemon.IV + `%`;
        await pusher.note(device.iden, 'Caught a ' + pokemon.name + '!', body);
        }
    }
};