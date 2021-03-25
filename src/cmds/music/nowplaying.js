const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function nowplaying(message, client, serverQueue) {
	if (!serverQueue) return message.channel.send('There is no queue!');
    let embed = new Discord.MessageEmbed()
    embed.setColor('RANDOM')
    embed.setTitle('Now Playing:')
    embed.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})${serverQueue.loop == true ? ' 🔂': serverQueue.loop == "all" ? ' 🔁' : ''}${serverQueue.shuffle && serverQueue.songs[1] ? '\n\n🔀 Shuffle is enabled, next song is a random song from the queue.': ''}`)
    if (serverQueue.shuffle == false) {
        if (serverQueue.songs[1]) embed.addField('Coming up next:', `[${serverQueue.songs[1].title}](${serverQueue.songs[1].url})`)
    }
    // embed.setFooter(`${client.user.tag}, now serving music in ${message.guild.name}`, client.user.displayAvatarURL)
    message.channel.send(embed)
}

module.exports = nowplaying