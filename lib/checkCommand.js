const config = require('../config.json');

const parser = require('yargs')
.commandDir('commands')
.showHelpOnFail(false)
.help();

module.exports = async (msg) => {
    const Users = db.models.users;

    const currentUser = await Users.findByAuthorId(msg.author.id);
    
    if(!currentUser || currentUser.roles.indexOf('admin') === -1) {
        return;
    }

    const content = msg.content.replace(config.commandPrefix, '');
    const args = parser.parse(content, {
        msg: msg
    });
}