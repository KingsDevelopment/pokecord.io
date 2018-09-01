const types = ["spawn", "spam"];

const commands = ["group", "remove", "sync"];

const group = async (channelId, group, argv) => {
    if(types.indexOf(group) === -1) {
        argv.msg.reply("Type " + group + " is not possible. Use one of the following: " + types.join(", "));
        return;
    }

    const Channels = db.models.channels;
    let channel = await Channels.findOne({
        channelId: channelId,
        type: group
    });

    if(channel) {
        await Channels.deleteById(channel._id);
        argv.msg.reply("Removed channel <#" + channelId + "> from group \"" + group + "\"");
        return;
    }

    channel = await Channels.create({
        channelId: channelId,
        guildId: argv.msg.channel.guild.id,
        type: group
    });

    argv.msg.reply("I added <#" + channelId + "> to the group \"" + group + "\"");
    return;
};

const remove = async (channelId, argv) => {
    const Channels = db.models.channels;
    let channel = await Channels.findOne({
        channelId: channelId
    });

    if(!channel) {
        argv.msg.reply("<#" + channelId + "> does not exist yet.");
        return;
    }

    await Channels.delete({
        channelId: channelId
    });

    argv.msg.reply("Removed <#" + channelId + "> from all groups.");
    return;
};

const sync = async (channelId, argv) => {
    const Channels = db.models.channels;
    let channel = await Channels.sync();

    if(channel) {
        await Channels.delete({
            type: 'sync'
        });

        argv.msg.reply("Removed old sync channel.");
    }

    channel = await Channels.create({
        channelId: channelId,
        guildId: argv.msg.channel.guild.id,
        type: 'sync'
    });

    argv.msg.reply("Set <#" + channelId + "> as sync channel.");
    return;
}

exports.command = 'channel <channel> <command> [group]';
exports.describe = "Set channel options.";
exports.builder = {};
exports.handler = async (argv) => {
    if(commands.indexOf(argv.command) === -1) {
        argv.msg.reply("Command " + argv.type + " is not possible. Use one of the following: " + commands.join(", "));
        return;
    }

    const matches = argv.channel.match(/<#(.*)>/);
    if(!matches || !matches.length || !matches[1]) {
        argv.msg.reply("Please tag the channel.");
        return;
    }

    const channelId = matches[1];
    if(argv.command === "group") {
        return group(channelId, argv.group, argv);
    }

    if(argv.command === "remove") {
        return remove(channelId, argv);
    }

    if(argv.command === "sync") {
        return sync(channelId, argv);
    }
};