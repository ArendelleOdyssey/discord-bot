const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function nowplaying(message, client, serverQueue) {
	if (!serverQueue) return message.channel.send('There is no queue!');
    let embed = new Discord.RichEmbed
    embed.setColor('RANDOM')
    embed.setTitle('Now Playing:')
    embed.setDescription(serverQueue.songs[0].title)
    if (serverQueue.songs[1]) embed.addField('Next song:', serverQueue.songs[1].title)
    embed.setFooter(`${client.user.tag}, now serving music in ${message.guild.name}`, client.user.displayAvatarURL)
    message.channel.send(embed)
}

module.exports = nowplaying