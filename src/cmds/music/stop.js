const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function stop(message, serverQueue, queue) {
    try {
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no queue!');
        serverQueue.connection.disconnect();
        queue.delete(message.guild.id)
        message.react('👋')
    } catch (err) {
        console.error(err)
        message.react('🖐')
    }
}

module.exports = stop