const showHelp = require('../showHelp');

const { RichEmbed } = require('discord.js');

const findChannel = (channelId) => {
    return client.channels
    .find(channel => 
        (channelId === channel.id));
};

const group = async (channelId, group, argv) => {
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

    const channelData = findChannel(channelId);
    channel = await Channels.create({
        name: channelData.name,
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

    const channelData = findChannel(channelId);
    channel = await Channels.create({
        name: channelData.name,
        channelId: channelId,
        guildId: argv.msg.channel.guild.id,
        type: 'sync'
    });

    argv.msg.reply("Set <#" + channelId + "> as sync channel.");
    return;
};

const list = async (argv) => {
    const Channels = db.models.channels;
    let channels = await Channels.find();
    
    if(!channels.length) {
        return argv.msg.reply("There are no channels configured.");
    }

    let returnString = "**Name | Group | Channel ID | Server ID**\n";
    for(let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        
        if(!channel.name) {
            const channelData = findChannel(channel.channelId);
            if(channelData) {
                channel.name = channelData.name;
            }
        }

        returnString += channel.name + " | " + channel.type + " | <#" + channel.channelId + "> | " + channel.guildId + "\n";
    }

    const embed = new RichEmbed()
    .setTitle("Channels")
    .setDescription(returnString);

    return argv.msg.channel.send(embed);
}

exports.command = 'channel <channel>';
exports.describe = "Set channel options.";
exports.builder = {
    group: {
        alias: 'g',
        requiresArg: true,
        describe: 'Set group for channel',
        type: 'string',
        choices: ['sync', 'spawn', 'spam', 'none']
    }
};
exports.handler = async (argv) => {
    if(argv.channel === "list") {
        return list(argv);
    }

    const matches = argv.channel.match(/((?:[0-9]{6}[ \\-]{1}[0-9]{12}|[0-9]{18}))(?![\\d])/);
    if(!matches || !matches.length || !matches[1] || !argv.group) {
        if(argv.channel !== 'help') {
            argv.msg.reply("Please tag the channel or add a channel id.");
        }

        return showHelp(argv);
    }

    const channelId = matches[1];
    if(argv.group === "spam" || argv.group === 'spawn') {
        return group(channelId, argv.group, argv);
    }

    if(argv.group === "none") {
        return remove(channelId, argv);
    }

    if(argv.group === "sync") {
        return sync(channelId, argv);
    }
};