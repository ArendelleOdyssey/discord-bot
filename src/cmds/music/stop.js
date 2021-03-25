const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function stop(message, serverQueue, queue, sql) {
    try {
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no queue!');
        sql.query("UPDATE `music` SET `isPlaying` = 0 WHERE `isPlaying` = 1;", (err)=>{
            if (err){
                console.error(err)
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error updating music log: \`\`\`${err}\`\`\``)
            }
        })
        serverQueue.connection.disconnect();
        queue.delete(message.guild.id)
        message.react('👋')
    } catch (err) {
        console.error(err)
        message.react('🖐')
    }
}

module.exports = stop