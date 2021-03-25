const Discord = require('discord.js')
const ytdl = require('ytdl-core');

function remove(message, serverQueue) {
	let args = message.content.split(' ');
    args.shift();

    if (args.length < 1) return message.channel.send('Enter a number in the queue to be removed, or put `all` to remove all the waiting songs')
    
    if (args[0].toLowerCase() == 'all'){
        serverQueue.songs.splice(1, serverQueue.songs.length)
        return message.channel.send('Removed all waiting queue')
    } else {
        var argNumber = Number(args[0])

        if (isNaN(argNumber)) {
            if (args[0].toLowerCase() == 'all'){
                serverQueue.songs.splice(1, serverQueue.songs.length)
                return message.channel.send('Removed all waiting queue')
            } else return message.react('❌')
        }

        if (argNumber > 1){
            var song = serverQueue.songs[argNumber-1]
            if (song == undefined) {
                song = serverQueue.songs[serverQueue.songs.length-1]
                serverQueue.songs.splice(serverQueue.songs.length-1, 1)
            }
            else serverQueue.songs.splice(argNumber-1, 1)
            return message.channel.send('Removed ' + song.title)
        } else return message.react('❌')
    }
}

module.exports = remove