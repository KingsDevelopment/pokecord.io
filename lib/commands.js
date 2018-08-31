const config = require('../config.json');

const commands = {
    spam: require('./commands/spam'),
    pokemon: require('./commands/pokemon')
};

module.exports = (client, msg) => {
    const message = msg.content.replace(config.commandPrefix, '');

    if(message.indexOf("spam") === 0) {
        return commands.spam(client, msg);
    }

    if(message.indexOf("pokemon") === 0) {
        return commands.pokemon(client, msg);
    }
}