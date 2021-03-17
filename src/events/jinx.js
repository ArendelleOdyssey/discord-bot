const Discord = require('discord.js')

var oldmsg = undefined
module.exports = function(client, message, sql){
    if (oldmsg == undefined) oldmsg = message
    else {
        if (oldmsg.content.toLowerCase() == message.content.toLowerCase()){
            if (oldmsg.author.bot || message.author.bot) return
            if (oldmsg.author.id == message.author.id) return
            if (oldmsg.channel.id != message.channel.id) return
            message.channel.send('https://cdn.discordapp.com/emojis/755280811447812127.png?v=1')
            sql.query("SELECT * FROM `jinxs`", function (err, res) {
                if (err) {
                    console.error(err)
                    client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error getting jinx counter: \`\`\`${err}\`\`\``)
                } else {
                    sql.query("UPDATE `jinxs` SET `count` = '?', `last` = ?", [res[0].count+1, new Date()], function (err, res) {
                        if (err) {
                            console.error(err)
                            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error updating jinx counter: \`\`\`${err}\`\`\``)
                        }
                    })
                }
            })
        }
        oldmsg = message
    }
}