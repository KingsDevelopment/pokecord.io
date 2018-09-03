const prefix = require('../prefix');
const showHelp = require('../showHelp');

exports.command = 'select <number>';
exports.describe = "Select a pokemon by their number";
exports.builder = {};
exports.handler = async (argv) => {
    if(argv.number === 'help') {
        return showHelp(argv);
    }

    const serverPrefix = await prefix(argv.msg)
    if(!argv.number || !parseInt(argv.number)) {
        argv.msg.reply("Please add a valid number.");
        return
    }

    argv.msg.channel.send(serverPrefix + "select " + argv.number);
    return;
};