const resemble = require('../resemble');
const showHelp = require('../showHelp');

exports.command = 'image <command> <url>';
exports.describe = "Test an image or get it's hash";
exports.builder = {};
exports.handler = async (argv) => {
    const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
    if(!regex.test(argv.url)) {
        return argv.msg.reply("Please provide a valid image url.");
    }

    if(argv.command === 'hash') {
        const hash = await resemble.hash(argv.url);
        return argv.msg.reply("The hash for your image is:\n" + hash);
    }

    if(argv.command === 'match') {
        const pokemon = await resemble.resemble(argv.url);
        if(!pokemon) {
            return argv.msg.reply("Sorry, I did not find a pokemon to that image.");
        }

        argv.msg.channel.send("Who's that pokemon?!");
        client.setTimeout(() => {
            argv.msg.channel.send("It's " + pokemon + "!");
        }, 2000);
        return;
    }

    return showHelp(argv);
};