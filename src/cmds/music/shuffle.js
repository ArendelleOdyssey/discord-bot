const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function shucmd(message, client, serverQueue) {
    //if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to shuffle the music!');
    if (!serverQueue) return message.channel.send('There is no queue!');
    if (serverQueue.shuffle == true) {
        serverQueue.shuffle = false;
	    message.react('➡')
    }
    else if (serverQueue.shuffle == false) {
        serverQueue.shuffle = true;
        message.react('🔀')
    }
}

module.exports = shucmd
