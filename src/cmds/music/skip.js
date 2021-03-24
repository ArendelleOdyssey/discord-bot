const Discord = require('discord.js')
const ytdl = require('ytdl-core');

function skip(message, serverQueue, play, queue) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.songs.shift();
    if (serverQueue.songs.length < 1){
        serverQueue.connection.disconnect();
        queue.delete(message.guild.id)
        message.react('⏹')
    } else {
        let embed = new Discord.MessageEmbed()
        embed.setAuthor('Now Playing 🎶', client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
        serverQueue.textChannel.send(embed).then(m=>m.delete(10000))
        play(message.guild, serverQueue.songs[0], queue)
        message.react('⏭')
    }
}

module.exports = skip