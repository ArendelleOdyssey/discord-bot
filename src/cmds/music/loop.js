const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function loop(message, client, serverQueue) {
	if (!serverQueue) return message.channel.send('There is no queue!');
    if (serverQueue.loop == undefined) serverQueue.loop = false
    if (serverQueue.loop == false) {
        serverQueue.loop = true
        message.react('🔂').then(m=>message.react('🆗'))
    } else if (serverQueue.loop == true) {
        serverQueue.loop = false
        message.react('🔂').then(m=>message.react('🛑'))
    }
}

module.exports = loop