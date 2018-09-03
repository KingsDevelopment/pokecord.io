const showHelp = require('../showHelp');

exports.command = 'kill [command]';
exports.describe = "Kills the bot";
exports.builder = {};
exports.handler = async (argv) => {
    if(argv.command && argv.command === 'help') {
        return showHelp(argv);
    }

    argv.msg.reply("Bye bye master, I am sorry for my mistakes..");
    await client.destroy();
    process.exit();
};