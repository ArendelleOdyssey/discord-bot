const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function shucmd(message, client, serverQueue) {
    //if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to shuffle the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    if (!serverQueue.shuffle) serverQueue.shuffle = false;
    if (serverQueue.shuffle == true) {
        serverQueue.shuffle = false;
	message.react('🔀')
    }
    else if (serverQueue.shuffle == false) {
        serverQueue.shuffle = true;
        message.react('🔀')
    }
}

module.exports = shucmd
