const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
const ytpl = require('ytpl')
const wait = require('util').promisify(setTimeout);

async function playlist(message, args, play, queue, serverQueue){
	try{
        ytpl(args[0].replace('https://www.youtube.com/playlist?list=',''), async function(err, playlist) {
		if(err){
			console.error(err)
			message.channel.send('Error: ' + err)
		}

		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!').then(m=>message.channel.stopTyping(true))
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!').then(m=>message.channel.stopTyping(true))
		}

		message.channel.send(`Adding ${playlist.items.length} songs to the queue, please be patient (it takes some times)`)

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 100,
				playing: true,
				loop : false,
				shuffle : false,
			};
  
			queue.set(message.guild.id, queueContruct);

			await Promise.all(playlist.items.map(async (item) => {
				const songInfo = await ytdl.getInfo(item.url_simple);
				const song = {
					title: songInfo.title,
					url: songInfo.video_url,
				};
				queueContruct.songs.push(song)
				console.log(`${songInfo.title} (${songInfo.video_url}) added in ${message.guild.name}`)
			  }));

				try {
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					await play(message.guild, queueContruct.songs[0], queue);
					message.channel.stopTyping(true)
					message.react('▶')
				} catch (err) {
					console.error(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			
		 } else {
			await Promise.all(playlist.items.map(async (item) => {
				const songInfo = await ytdl.getInfo(item.url_simple);
				const song = {
					title: songInfo.title,
					url: songInfo.video_url,
				};
				serverQueue.songs.push(song)
				console.log(`[Playlist] ${songInfo.title} (${songInfo.video_url}) added in ${message.guild.name}`)
			  }));
			 message.channel.stopTyping(true)
		}
	});
        } catch (err) {
                console.error(err)
                message.channel.send('Error: ' + err)
        }
}

async function launch(message, url, play, queue, serverQueue){
        try {
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!').then(m=>message.channel.stopTyping(true))
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!').then(m=>message.channel.stopTyping(true))
	}

	const songInfo = await ytdl.getInfo(url);
	const song = {
		title: songInfo.title,
		url: url,
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
			shuffle : false,
		};
	  
		queue.set(message.guild.id, queueContruct);
	  
		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0], queue);
			message.channel.stopTyping(true)
                        message.react('▶')
		} catch (err) {
			console.error(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		message.channel.send(`\`${song.title}\` has been added to the queue!`).then(m=>message.channel.stopTyping(true))
	}
	console.log(`${songInfo.title} (${songInfo.video_url}) added in ${message.guild.name}`)
        } catch (err) {
                console.error(err)
                message.channel.send('Error: ' + err)
        }
}

function search(message, args, play, serverQueue, queue){
	try{
	let filter;
	ytsr.getFilters(args.join(' '), function(err, filters) {
		if(err){
			console.error(err)
			message.channel.send(err)
		}
		filter = filters.get('Type').find(o => o.name === 'Video');
		ytsr.getFilters(filter.ref, function(err, filters) {
			if(err){
				console.error(err)
				message.channel.send(err)
			}
			filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
			var options = {
				limit: 5,
				nextpageRef: filter.ref,
			}
			ytsr(null, options, async function(err, searchResults) {
				if(err){
					console.error(err)
					message.channel.send(err)
				}
				var url = searchResults.items[0].link
				launch(message, url, play, queue, serverQueue)
			});
	  	});
	  });
	} catch(err){
		console.error(err)
		message.channel.send(err)
	}
}

module.exports = async function(message, play, serverQueue, queue) {
    try {
        let args = message.content.split(' ');
        args.shift();
    
        if (args.length < 1) return message.channel.send('Need search or URL')
        
        if (args[0].startsWith('https://www.youtube.com/playlist?list=')) {
            playlist(message, args, play, queue, serverQueue)
        } else if (args[0].startsWith('https://www.youtube.com/watch?v=')){
            launch(message, args[0], play, queue, serverQueue)
        } else {
            search(message, args, play, serverQueue, queue)
        }
    } catch (err) {
        console.error(err)
        message.channel.send('Error')
    }
}
