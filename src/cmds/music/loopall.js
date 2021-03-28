const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function loop(message, client, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to loop the music!');
	if (!serverQueue) return message.channel.send('There is no queue!');
    if (serverQueue.loop == undefined) serverQueue.loop = false
    if (serverQueue.loopall == undefined) serverQueue.loopall = false

    if (serverQueue.loopall == false) {
        serverQueue.loop = false
        serverQueue.loopall = true
        message.react('🔁')
    } else if (serverQueue.loopall == true || serverQueue.loop == true) {
        serverQueue.loop = false
        serverQueue.loopall = false
        message.react('➡')
    }
}

module.exports = loop