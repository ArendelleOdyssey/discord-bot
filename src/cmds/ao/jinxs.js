const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(message, client, prefix, sql){
    if (message.content.toLowerCase() == prefix + 'jinxs'){
        sql.query("SELECT * FROM `jinxs`", (err,res)=>{
            if (err){
                console.error(err)
                message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error getting jinxs counter: \`\`\`${err}\`\`\``)
            } else {
                const randommsgs = JSON.parse(fs.readFileSync('./data/jinx_counter_messages.json'))
                let embed = new Discord.MessageEmbed()
                embed.setTitle('Jinx! counter')
                .setDescription(`We are at ${res[0].count} Jinxs!, ${randomItem(randommsgs)}`)
                .setThumbnail('https://cdn.discordapp.com/emojis/755280811447812127.png?v=1')
                .setFooter('The latest jinx was sent:')
                .setTimestamp(res[0].last)
                message.channel.send(embed)
            }
        })
    }
}