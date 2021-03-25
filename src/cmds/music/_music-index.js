const Disord = require('discord.js')

var queue = new Map();

module.exports = function(message, client, prefix, sql){
    
    const serverQueue = queue.get(message.guild.id)
    const play = require('./play.js')

    if (message.content.toLowerCase().startsWith(`${prefix}playnow`) || message.content.toLowerCase().startsWith(`${prefix}pn`)) require('./executeNow.js')(message, client, play, serverQueue, queue, sql);
    else if (message.content.toLowerCase().startsWith(`${prefix}play`) || message.content.toLowerCase().startsWith(`${prefix}p`)) require('./execute.js')(message, client, play, serverQueue, queue, sql);
    else if (message.content.toLowerCase().startsWith(`${prefix}remove`)) require('./remove.js')(message, serverQueue);
    else if (message.content.toLowerCase() == `${prefix}skip` || message.content.toLowerCase() == `${prefix}s`) require('./skip.js')(message, client, serverQueue, play, queue, sql);
    else if (message.content.toLowerCase() == `${prefix}stop` || message.content.toLowerCase() == `${prefix}leave`) require('./stop.js')(message, serverQueue, queue, sql);
    else if (message.content.toLowerCase().startsWith(`${prefix}search`)) require('./search.js')(message, prefix);
    else if (message.content.toLowerCase() == `${prefix}queue` || message.content.toLowerCase() == `${prefix}q`) require('./queue.js')(message, serverQueue);
	else if (message.content.toLowerCase() == `${prefix}nowplaying` || message.content.toLowerCase() == `${prefix}np`) require('./nowplaying.js')(message, client, serverQueue);
    else if (message.content.toLowerCase() == `${prefix}volume` || message.content.toLowerCase() == `${prefix}vol`) require('./volume.js')(message);
	else if (message.content.toLowerCase() == `${prefix}loop`) require('./loop.js')(message, client, serverQueue);
	else if (message.content.toLowerCase() == `${prefix}shuffle`) require('./shuffle.js')(message, client, serverQueue);

    else if (message.content.toLowerCase() == prefix + 'music'){
        let embed = new Disord.MessageEmbed()
        .setColor('RANDOM')
        .setAuthor('Play your music with ' + client.user.username)
        .setDescription(`Join a voice channel, type \`${prefix}p [Youtube URL or search]\` and boom! Music! 🎶\n\n**__More commands:__**`)
        .addField(prefix + 'pn', 'Play directly at the next', true)
        .addField(prefix + 'search', 'Search a song', true)
        .addField(prefix + 'q', 'Show the queue', true)
        .addField(prefix + 's', 'Skip that song', true)
        .addField(prefix + 'remove', 'Remove one song from the queue or clear the queue', true)
        .addField(prefix + 'stop', 'Stop and leaves the channel', true)
        .addField(prefix + 'loop', 'Enables loop (one song)', true)
        .addField(prefix + 'shuffle', 'Enables shuffle (takes randomly one song from the queue to play)', true)
        message.channel.send(embed)
    }
}
