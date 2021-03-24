const Disord = require('discord.js')

var queue = new Map();

module.exports = function(message, client, prefix){
    
    const serverQueue = queue.get(message.guild.id)
    const play = require('./play.js')

    if (message.content.toLowerCase().startsWith(`${prefix}playnow`) || message.content.toLowerCase().startsWith(`${prefix}pn`)) require('./executeNow.js')(message, play, serverQueue, queue);
    else if (message.content.toLowerCase().startsWith(`${prefix}play`) || message.content.toLowerCase().startsWith(`${prefix}`)) require('./execute.js')(message, play, serverQueue, queue);
    else if (message.content.toLowerCase().startsWith(`${prefix}remove`)) require('./remove.js')(message, serverQueue);
    else if (message.content.toLowerCase() == `${prefix}skip` || message.content.toLowerCase() == `${prefix}s`) require('./skip.js')(message, serverQueue, play, queue);
    else if (message.content.toLowerCase() == `${prefix}stop` || message.content.toLowerCase() == `${prefix}leave`) require('./stop.js')(message, serverQueue, queue);
    else if (message.content.toLowerCase() == `${prefix}queue` || message.content.toLowerCase() == `${prefix}q`) require('./queue.js')(message, serverQueue);
	else if (message.content.toLowerCase() == `${prefix}nowplaying` || message.content.toLowerCase() == `${prefix}np`) require('./nowplaying.js')(message, client, serverQueue);
    else if (message.content.toLowerCase() == `${prefix}volume` || message.content.toLowerCase() == `${prefix}vol`) require('./volume.js')(message);
	else if (message.content.toLowerCase() == `${prefix}loop`) require('./loop.js')(message, client, serverQueue);
	else if (message.content.toLowerCase() == `${prefix}shuffle`) require('./shuffle.js')(message, client, serverQueue);
}
