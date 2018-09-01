const BaseModel = require('./model');

class Guilds extends BaseModel {
    constructor(mongoose) {
        super(mongoose, 'guilds', { 
            guildId: String,
            prefix: String,
            rate: Number
        });
    }

    getByGuildId(guildId) {
        return this.model.findOne({
            guildId: guildId
        })
        .exec();
    }

    addGuild(data) {

    }
}

module.exports = Guilds;