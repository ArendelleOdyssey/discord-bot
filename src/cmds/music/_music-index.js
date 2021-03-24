const Disord = require('discord.js')

var queue = new Map();

module.exports = function(message, client, prefix){
    
    const serverQueue = queue.get(message.guild.id)

    if (message.content.toLowerCase().startsWith(`${prefix}playnow `) || message.content.toLowerCase().startsWith(`${prefix}pn `)) require('./executenow.js')(message, play, serverQueue, queue);
    else if (message.content.toLowerCase().startsWith(`${prefix}play `) || message.content.toLowerCase().startsWith(`${prefix}p `)) require('./execute.js')(message, play, serverQueue, queue);
    else if (message.content.toLowerCase() == `${prefix}skip`) require('./skip.js')(message, serverQueue);
    else if (message.content.toLowerCase() == `${prefix}stop` || message.content.toLowerCase() == `${prefix}leave`) require('./stop.js')(message, serverQueue);
    else if (message.content.toLowerCase() == `${prefix}queue` || message.content.toLowerCase() == `${prefix}q`) require('./queue.js')(message, serverQueue);
	else if (message.content.toLowerCase() == `${prefix}nowplaying` || message.content.toLowerCase() == `${prefix}np`) require('./nowplaying.js')(message, client, serverQueue);
    else if (message.content.toLowerCase().startsWith(`${prefix}volume`) || message.content.toLowerCase().startsWith(`${prefix}vol`)) require('./volume.js')(message);
	else if (message.content.toLowerCase() == `${prefix}loop`) require('./loop.js')(message, client, serverQueue);
	else if (message.content.toLowerCase() == `${prefix}shuffle`) require('./shuffle.js')(message, client, serverQueue);
}
