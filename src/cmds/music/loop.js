const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function loop(message, client, serverQueue) {
	if (!serverQueue) return message.channel.send('There is no queue!');
    if (serverQueue.loop == undefined) serverQueue.loop = false
    let args = message.content.split(' ');
    args.shift();

    if (args.length < 1){
        if (serverQueue.loop == false) {
            serverQueue.loop = true
            message.react('🔂')
        } else if (serverQueue.loop == true) {
            serverQueue.loop = false
            message.react('➡')
        }
    } else if (args[0].toLowerCase() == 'all'){
        if (serverQueue.loop == false || serverQueue.loop == true) {
            serverQueue.loop = "all"
            message.react('🔁')
        } else if (serverQueue.loop == "all") {
            serverQueue.loop = false
            message.react('➡')
        }
    }
}

module.exports = loop