const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    if (serverQueue.loop == true) serverQueue.songs.shift();
    serverQueue.connection.dispatcher.end();
    message.react('⏯')
}

module.exports = skip