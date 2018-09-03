const checkCommand = require('./checkCommand');
const catcher = require('./catcher');
const syncer = require('./syncer');

const config  = require('../config.json');

module.exports = async (msg) => {
    if(msg.content.indexOf(config.commandPrefix) === 0) {
        return checkCommand(msg);
    }
    
    const channels = db.models.channels;
    const spawnChannels = await channels.spawn();
    if(spawnChannels.indexOf(msg.channel.id) != -1) { 
        return catcher(msg);   
    }
    
    const syncChannel = await channels.sync();
    if(syncChannel && syncChannel.channelId === msg.channel.id) {
        return syncer.onMessage(msg);
    }
};