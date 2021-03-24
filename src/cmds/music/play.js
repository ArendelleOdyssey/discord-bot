const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function play(guild, client, song, queue) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
        serverQueue.connection.disconnect();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url, { quality: 'highestaudio' }))
		.on('finish', () => {
			if (serverQueue.loop == false) serverQueue.songs.shift();
            if (serverQueue.shuffle == true) {
                if (serverQueue.loop == false) {
                    let random = Math.floor(Math.random() * serverQueue.songs.length)
                    var newFirst = serverQueue.songs[random]
                    serverQueue.songs.splice(newFirst, 1);
				    serverQueue.songs.unshift(newFirst)
                }
            }
            let embed = new Discord.MessageEmbed()
            embed.setAuthor('Now Playing 🎶', client.user.displayAvatarURL({dynamic: true}))
            .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
            serverQueue.textChannel.send(embed).then(m=>m.delete({timeout: 30000}))
            play(guild, client, serverQueue.songs[0], queue);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    
    serverQueue.connection.on('disconnect', ()=>{
        queue.delete(guild.id)
    })
}

module.exports = play
