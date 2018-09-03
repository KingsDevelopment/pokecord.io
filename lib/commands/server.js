const showHelp = require('../showHelp');

const { RichEmbed } = require('discord.js');

const findGuild = (guildId) => {
    return client.guilds
    .find(guild => 
        (guildId === guild.id));
};

const findOrCreate = async (guildId) => {
    const Guilds = db.models.guilds;
    let guild = await Guilds.findOne({
        guildId: guildId
    });

    if(!guild) {
        const guildData = findGuild(guildId);
        guild = await Guild.create({
            name: guildData.name,
            prefix: 'p!',
            rate: 70,
            guildId: guildData.id
        });
    }

    return guild;
};

const prefix = async (argv, prefix, guildId) => {
    const guild = await findOrCreate(guildId);

    guild.prefix = prefix;
    await guild.save();

    argv.msg.reply("Saved prefix for server: " + guild.name + "!");
};

const rate = async (argv, rate, guildId) => {
    const guild = await findOrCreate(guildId);
    
    guild.rate = rate;
    await guild.save();

    argv.msg.reply("Saved prefix for server: " + guild.name + "!");
};

const list = async (argv) => {
    const Guilds = db.models.guilds;
    let guilds = await Guilds.find();
    
    if(!guilds.length) {
        return argv.msg.reply("There are no channels configured.");
    }

    let returnString = "**Name | Rate | Prefix | Server ID**\n";
    for(let i = 0; i < guilds.length; i++) {
        const guild = guilds[i];
        
        if(!guild.name) {
            const guildData = findGuild(guild.guildId);
            if(guildData) {
                guild.name = guildData.name;
                
                await Guilds.update(guild._id, {
                    name: guild.name
                });
            }
        }

        returnString += guild.name + " | " + guild.rate + " | " + guild.prefix + " | " + guild.guildId + "\n";
    }

    const embed = new RichEmbed()
    .setTitle("Servers")
    .setDescription(returnString);

    return argv.msg.channel.send(embed);
}

exports.command = 'server <command> [rate|prefix] [serverId]';
exports.describe = "Set server options.";
exports.builder = {};
exports.handler = async (argv) => {
    let serverId = argv.msg.channel.guild.id;
    if(argv.serverId) {
        const matches = argv.serverId.match(/((?:[0-9]{6}[ \\-]{1}[0-9]{12}|[0-9]{18}))(?![\\d])/);
        if(matches && matches.length && matches[1]) {
            serverId = argv.serverId
        }
    }

    if(argv.command === 'help') {
        return showHelp(argv);
    }

    if(argv.command === "list") {
        return list(argv);
    }

    if(argv.command === "prefix") {
        if(!argv.prefix) {
            return argv.msg.reply("Please provide a valid prefix.");
        }

        return prefix(argv, argv.prefix, serverId);
    }

    if(argv.command === "rate") {
        if(!argv.rate || isNaN(parseInt(argv.rate))) {
            return argv.msg.reply("Rate must be a number.");
        }
        return rate(argv, argv.rate, serverId);
    }
};