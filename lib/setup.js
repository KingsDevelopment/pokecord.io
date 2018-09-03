const onMessage = require('./onMessage');
const db = require('./db');
const spammer = require('./spammer');
const syncer = require('./syncer');

const config = require('../config.json');

const checkAdmin= async (db) => {
    const Users = db.models.users;

    let adminUser = await Users.findByAuthorId(config.adminId);

    if(!adminUser) {
        adminUser = await Users.create({
            authorId: config.adminId
        });
    }

    if(adminUser.roles.indexOf('admin') === -1) {
        adminUser.roles.push('admin');
        await adminUser.save();
    }

    return;
};

module.exports = async () => {
    const connectedDb = await db();
    await checkAdmin(connectedDb);
    await spammer();
    await syncer.init();
    
    client.on('message', onMessage);
}