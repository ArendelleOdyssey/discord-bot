const Discord = require('discord.js')
const ytdl = require('ytdl-core');

function skip(message, serverQueue, play, queue) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.songs.shift();
    serverQueue.connection.dispatcher.end();
    play(message.guild, serverQueue.songs[0], queue)
    message.react('⏯')
}

module.exports = skip