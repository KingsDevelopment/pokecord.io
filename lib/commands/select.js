const prefix = require('../prefix');

exports.command = 'select <number>';
exports.describe = "Select a pokemon to level";
exports.builder = {};
exports.handler = async (argv) => {
    const serverPrefix = await prefix(argv.msg)
    if(!argv.number || !parseInt(argv.number)) {
        argv.msg.reply("Please add a valid number.");
        return
    }

    argv.msg.channel.send(serverPrefix + "select " + argv.number);
    return;
};