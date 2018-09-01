const BaseModel = require('./model');

class Pokemons extends BaseModel {
    constructor(mongoose) {
        super(mongoose, 'pokemons', { 
            name: String,
            level: Number,
            number: Number,
            IV: Number,
            lastSynced: Date
        });
    }
}

module.exports = Pokemons;