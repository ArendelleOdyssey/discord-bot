const Discord = require('discord.js')
const ytdl = require('ytdl-core')

function fetchQueue(message, serverQueue){
    const listarray = [];
    totalcount = 1;
    serverQueue.songs.forEach(song=>{
        if (totalcount === 1) {
            listarray.push(`NOW PLAYING :        ${song.title}`)
        } else {
            listarray.push(`${totalcount} :                ${song.title}`)
        }
        totalcount++
    })
    return listarray
}

function updateQueue(client, queueList, list, listFirst, listLast, serverQueue){
    var theUser
    const filter = (reaction, user) => {
        theUser = user;
        return ['🔼', '🔽'].includes(reaction.emoji.name) && user.id != client.user.id
    };

    queueList.awaitReactions(filter, { max: 1, time: 10*60*1000 })
        .then(collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '🔽') {
                if(listLast != list.length){
                    listFirst++
                    listLast++
                }
            } else if (reaction.emoji.name === '🔼') {
                if(listFirst != 0){
                    listFirst--
                    listLast--
                }
            }

            queueList.edit(`\`\`\`css\n${list.slice(listFirst, listLast).join("\n")}\`\`\`Total songs in queue: ${serverQueue.songs.length}. ${serverQueue.loop ? 'Loop one song activated. Shuffle ignored.' : ''} ${serverQueue.shuffle ? 'Shuffle activated.' : ''}`)
            reaction.users.remove(theUser.id)
            updateQueue(client, queueList, list, listFirst, listLast, serverQueue)
        })
}

async function queue(message, client, serverQueue) {
	if (!serverQueue) return message.channel.send('There is no queue!');

    var list = fetchQueue(message, serverQueue)
    var listFirst = 0
    var listLast = 20

    const queueList = await message.channel.send(`\`\`\`css\n${list.slice(listFirst, listLast).join("\n")}\`\`\`Total songs in queue: ${serverQueue.songs.length}. ${serverQueue.loop ? 'Loop one song activated. Shuffle ignored.' : ''} ${serverQueue.shuffle ? 'Shuffle activated.' : ''}`)

    queueList.react('🔼').then(() => queueList.react('🔽'));

    updateQueue(client, queueList, list, listFirst, listLast, serverQueue)
}

module.exports = queue
