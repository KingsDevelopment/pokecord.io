const mongoose = require('mongoose');

const config = require('../config.json');

// models
const Pokemons = require('../models/pokemons');
const Guilds = require('../models/guilds');
const Users = require('../models/users');
const Channels = require('../models/channels');

module.exports =  async () => {
    mongoose.connect(`mongodb://${config.dbHost}/pokecordio`, { useNewUrlParser: true });

    global.db = {
        mongoose: mongoose,
        models: {
            pokemons: new Pokemons(mongoose),
            users: new Users(mongoose),
            channels: new Channels(mongoose),
            guilds: new Guilds(mongoose)
        }
    };

    return global.db;
};