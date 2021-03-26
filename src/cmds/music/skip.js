const Discord = require('discord.js')
const ytdl = require('ytdl-core');

function skip(message, client, serverQueue, play, queue, sql) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to skip the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    sql.query("UPDATE `music` SET `isPlaying` = 0 WHERE `link` = ? AND `isPlaying` = 1;", serverQueue.songs[0].url, (err)=>{
        if (err){
            console.error(err)
            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error updating music log: \`\`\`${err}\`\`\``)
        }
    })
    if (serverQueue.shuffle == true) {
        let random = Math.floor(Math.random() * serverQueue.songs.length)
        var newFirst = serverQueue.songs[random]
        serverQueue.songs.splice(random, 1);
        serverQueue.songs.unshift(newFirst)
    } else serverQueue.songs.shift();
    if (serverQueue.songs.length < 1){
        serverQueue.connection.disconnect();
        queue.delete(message.guild.id)
        message.react('⏹')
    } else {
        let embed = new Discord.MessageEmbed()
        embed.setAuthor('Now Playing 🎶', client.user.displayAvatarURL({dynamic: true}))
            .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
        serverQueue.textChannel.send(embed).then(m=>m.delete({timeout: 30000}))
        play(message.guild, client, serverQueue.songs[0], queue, sql)
        message.react('⏭')
    }
}

module.exports = skip