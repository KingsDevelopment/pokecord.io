const config = require('../../config.json');
const prefix = require('../prefix');

module.exports = async (client, msg) => {
    msg.channel.send(prefix(msg) + "pokemon");
};