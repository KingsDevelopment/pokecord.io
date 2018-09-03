const BaseModel = require('./model');

class Channels extends BaseModel {
    constructor(mongoose) {
        super(mongoose, 'channels', { 
            name: String,
            channelId: String,
            guildId: String,
            type: String
        });
    }

    async spam() {
        const data = await this.model
        .find({
            type: 'spam'
        })
        .exec();

        return data.map(obj => obj.channelId);
    }

    async spawn() {
        const data = await this.model
        .find({
            type: 'spawn'
        })
        .exec();

        return data.map(obj => obj.channelId);
    }

    sync() {
        return this.model
        .findOne({
            type: 'sync'
        })
        .exec();
    }
}

module.exports = Channels;