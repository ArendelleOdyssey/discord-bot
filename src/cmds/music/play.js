const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const scdl = require('soundcloud-downloader').default

async function play(guild, client, song, queue, sql) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
        serverQueue.connection.disconnect();
		queue.delete(guild.id);
		return;
	}

    sql.query("INSERT INTO `music` (name, link, dateOfPlay, isPlaying) VALUES (?,?,?,1)", [song.title, song.url, new Date().toJSON()], (err)=>{
        if (err){
            console.error(err)
            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error adding music log: \`\`\`${err}\`\`\``)
        }
    })

    var stream;
    if (song.url.includes('youtube')){
        stream = ytdl(song.url, { quality: 'highestaudio' })
    } else if (song.url.includes('soundcloud')){
        stream = await scdl.download(song.url)
    }

	const dispatcher = serverQueue.connection.play(stream)
		.on('finish', () => {
            sql.query("UPDATE `music` SET `isPlaying` = 0 WHERE `link` = ? AND `isPlaying` = 1;", serverQueue.songs[0].url, (err)=>{
                if (err){
                    console.error(err)
                    client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error updating music log: \`\`\`${err}\`\`\``)
                }
            })

			if (serverQueue.loop == false) serverQueue.songs.shift();
			else if (serverQueue.loopall == true) {
                var song = serverQueue.songs[0]
                serverQueue.songs.shift();
                serverQueue.songs.push(song)
            }
            if (serverQueue.shuffle == true) {
                if (serverQueue.loop == false) {
                    let random = Math.floor(Math.random() * serverQueue.songs.length)
                    var newFirst = serverQueue.songs[random]
                    serverQueue.songs.splice(random, 1);
				    serverQueue.songs.unshift(newFirst)
                }
            }
            if (serverQueue.songs[0] == undefined){
                serverQueue.connection.disconnect();
                sql.query("UPDATE `music` SET `isPlaying` = 0 WHERE `isPlaying` = 1;", (err)=>{
                    if (err){
                        console.error(err)
                        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error updating music log: \`\`\`${err}\`\`\``)
                    }
                })
                queue.delete(guild.id)
            } else {
                let embed = new Discord.MessageEmbed()
                embed.setAuthor('Now Playing 🎶', client.user.displayAvatarURL({dynamic: true}))
                .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
                if (serverQueue.songs[1]) embed.addField('Coming up next:', `[${serverQueue.songs[1].title}](${serverQueue.songs[1].url})`)
                serverQueue.textChannel.send(embed).then(m=>m.delete({timeout: 30000}))
                play(guild, client, serverQueue.songs[0], queue, sql);
            }
		})
		.on('error', error => {
			console.error(error);
            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error while playing music song: \`\`\`${error}\`\`\``)
            serverQueue.textChannel.sned('I have a problem while playing '+serverQueue.songs[0].title+', this bug is reported.\nI\'ll skip the song, sorry :/')
            serverQueue.songs.shift();
            if (serverQueue.shuffle == true) {
                let random = Math.floor(Math.random() * serverQueue.songs.length)
                var newFirst = serverQueue.songs[random]
                serverQueue.songs.splice(random, 1);
                serverQueue.songs.unshift(newFirst)
            }
            play(guild, client, serverQueue.songs[0], queue, sql);
        });
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    
    serverQueue.connection.on('disconnect', ()=>{
        sql.query("UPDATE `music` SET `isPlaying` = 0 WHERE `isPlaying` = 1;", (err)=>{
            if (err){
                console.error(err)
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error updating music log: \`\`\`${err}\`\`\``)
            }
        })
        queue.delete(guild.id)
    })
}

module.exports = play
