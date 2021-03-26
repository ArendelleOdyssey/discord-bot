const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
const ytpl = require('ytpl')
const wait = require('util').promisify(setTimeout);

async function playlist(message, client, args, play, queue, serverQueue, sql){
	try{
        var playlist = await ytpl(args[0].replace('https://music.youtube.com/playlist?list=','').replace('https://www.youtube.com/playlist?list=',''), {pages: Infinity})

		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!').then(m=>message.channel.stopTyping(true))
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!').then(m=>message.channel.stopTyping(true))
		}

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 100,
				playing: true,
				loop : false,
				loopall : false,
				shuffle : false,
			};

            while (true) {
                await Promise.all(playlist.items.map(async (item) => {
                    const song = {
                        title: item.title,
                        url: item.shortUrl,
                    };
                    queueContruct.songs.push(song)
                }));

                if (playlist.continuation != null){
                    playlist = ytpl.continueReq(playlist.continuation);
                } else break;
            }

            message.channel.send(`Added ${queueContruct.songs.length} songs to the queue.`)
  
			queue.set(message.guild.id, queueContruct);

				try {
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					await play(message.guild, client, queueContruct.songs[0], queue, sql);
					message.channel.stopTyping(true)
					message.react('▶')
				} catch (err) {
					console.error(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			
		 } else {
            var i = 1
            while (true) {
                await Promise.all(playlist.items.map(async (item) => {
                    const song = {
                        title: item.title,
                        url: item.shortUrl,
                    };
                    serverQueue.songs.splice(i,0,song);
                    i++
                }));

                if (playlist.continuation != null){
                    playlist = ytpl.continueReq(playlist.continuation);
                } else break;
            }
            message.channel.send(`Added ${i-1} songs to the first on the queue`)
		}
		
    } catch (err) {
        console.error(err)
        message.channel.send('Error: ' + err)
    }
}

async function launch(message, client, url, play, queue, serverQueue, sql){
        try {
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!').then(m=>message.channel.stopTyping(true))
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!').then(m=>message.channel.stopTyping(true))
	}

	const songInfo = await ytdl.getInfo(url);
	const song = {
		title: songInfo.videoDetails.title,
		url: songInfo.videoDetails.video_url,
	};
	
	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [song],
			volume: 100,
			playing: true,
			loop: false,
			loopall: false,
			shuffle : false,
		};
	  
		queue.set(message.guild.id, queueContruct);
	  
		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, client, queueContruct.songs[0], queue, sql);
			message.channel.stopTyping(true)
            message.react('▶')
		} catch (err) {
			console.error(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.splice(1,0,song);
		message.channel.send(`\`${song.title}\` has been added to the first in the queue!`).then(m=>message.channel.stopTyping(true))
	}
        } catch (err) {
                console.error(err)
                message.channel.send('Error: ' + err)
        }
}

async function launchPlaylist(message, client, url, play, queue, serverQueue, sql){
    try {
const voiceChannel = message.member.voice.channel;
if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!').then(m=>message.channel.stopTyping(true))
const permissions = voiceChannel.permissionsFor(message.client.user);
if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!').then(m=>message.channel.stopTyping(true))
}

const songInfo = await ytdl.getInfo(url);
const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
};

var playlist = await ytpl(url.substring(url.indexOf('list=')+5, url.indexOf('&index=')), {pages: Infinity})

if (!serverQueue) {
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [song],
        volume: 100,
        playing: true,
        loop: false,
        loopall: false,
        shuffle : false,
    };

    while (true) {
        await Promise.all(playlist.items.map(async (item) => {
            if (item.shortUrl != song.url){
                const song = {
                    title: item.title,
                    url: item.shortUrl,
                };
                queueContruct.songs.push(song)
            }
        }));
    
        if (playlist.continuation != null){
            playlist = ytpl.continueReq(playlist.continuation);
        } else break;
    }

    message.channel.send(`Added ${queueContruct.songs.length+1} songs to the queue.`)
  
    queue.set(message.guild.id, queueContruct);
  
    try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, client, queueContruct.songs[0], queue, sql);
        message.channel.stopTyping(true)
        message.react('▶')
    } catch (err) {
        console.error(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }
} else {
    serverQueue.songs.splice(1,0,song);
    var i = 2
    while (true) {
        await Promise.all(playlist.items.map(async (item) => {
            if (item.shortUrl != song.url){
                const song = {
                    title: item.title,
                    url: item.shortUrl,
                };
                serverQueue.songs.splice(i,0,song);
                i++
            }
        }));

        if (playlist.continuation != null){
            playlist = ytpl.continueReq(playlist.continuation);
        } else break;
    }
    message.channel.send(`Added ${i-2} songs in the first of the queue`)
}
    } catch (err) {
            console.error(err)
            message.channel.send('Error: ' + err)
    }
}

async function search(message, client, args, play, serverQueue, queue, sql){
	try{
		let filter;
	    const filters1 = await ytsr.getFilters(args.join(' '))
		const filter1 = filters1.get('Type').get('Video');
        const filters2 = await ytsr.getFilters(filter1.url)
        const filter2 = filters2.get('Duration').get('Short (< 4 minutes)');
        var options = {
            limit: 1
        }
        var searchResults = await ytsr(filter2.url, options)
        if (searchResults.items.length < 1) return message.channel.send('Nothing found, try something else or put a YouTube URL')
        var url = searchResults.items[0].url
        launch(message, client, url, play, queue, serverQueue)
	} catch(err){
		console.error(err)
		message.channel.send(err)
	}
}

module.exports = async function(message, client, play, serverQueue, queue, sql) {
    try {
        let args = message.content.split(' ');
        args.shift();
    
        if (args.length < 1) return message.channel.send('Need search or URL')
        
        if (!isNaN(Number(args[0]))){
            if (!serverQueue) {
                if (args[0].startsWith('https://www.youtube.com/playlist?list=') || args[0].startsWith('https://music.youtube.com/playlist?list=')) {
                    playlist(message, client, args, play, queue, serverQueue, sql)
                } else if (args[0].startsWith('https://www.youtube.com/watch?v=') || args[0].startsWith('https://music.youtube.com/watch?v=')){
                    if (args[0].includes('list=')) launchPlaylist(message, client, args[0], play, serverQueue, sql)
                    else launch(message, client, args[0], play, queue, serverQueue, sql)
                } else {
                    search(message, client, args, play, serverQueue, queue, sql)
                }
            } else {
                var newFirst = serverQueue.songs[Number(args[0])-1]
                if (!newFirst){
                    if (args[0].startsWith('https://www.youtube.com/playlist?list=') || args[0].startsWith('https://music.youtube.com/playlist?list=')) {
                        playlist(message, client, args, play, queue, serverQueue, sql)
                    } else if (args[0].startsWith('https://www.youtube.com/watch?v=') || args[0].startsWith('https://music.youtube.com/watch?v=')){
                        if (args[0].includes('list=')) launchPlaylist(message, client, args[0], play, serverQueue, sql)
                        else launch(message, client, args[0], play, queue, serverQueue, sql)
                    } else {
                        search(message, client, args, play, serverQueue, queue, sql)
                    }
                } else {
                    serverQueue.songs.splice(Number(args[0])-1, 1);
                    serverQueue.songs.splice(1,0,newFirst)
                    message.channel.send(`Moved ${newFirst.title} to the next song to play. ${serverQueue.shuffle ? '\n**Shuffle is enabled, be sure to disable to get your song played**': ''}`)
                }
            }
        } else {
            if (args[0].startsWith('https://www.youtube.com/playlist?list=') || args[0].startsWith('https://music.youtube.com/playlist?list=')) {
                playlist(message, client, args, play, queue, serverQueue, sql)
            } else if (args[0].startsWith('https://www.youtube.com/watch?v=') || args[0].startsWith('https://music.youtube.com/watch?v=')){
                if (args[0].includes('list=')) launchPlaylist(message, client, args[0], play, serverQueue, sql)
                else launch(message, client, args[0], play, queue, serverQueue, sql)
            } else {
                search(message, client, args, play, serverQueue, queue, sql)
            }
        }        
    } catch (err) {
        console.error(err)
        message.channel.send('Error')
    }
}
