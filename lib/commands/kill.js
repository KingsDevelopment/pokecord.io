exports.command = 'kill';
exports.describe = "kill the bot";
exports.builder = {};
exports.handler = async (argv) => {
    argv.msg.reply("Bye bye master, I am sorry for my mistakes..");
    await client.destroy();
    process.exit();
};