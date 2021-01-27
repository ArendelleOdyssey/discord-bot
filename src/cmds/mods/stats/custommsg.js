const Discord = require('discord.js')
const Table = require('easy-table')
const fs = require('fs')

module.exports = function(message, client, prefix, config, sql){
    sql.query("SELECT `user`, COUNT(*) AS `nbmessages` FROM `mention_responses` GROUP BY `user`", function(err, res){
        if (err){
            console.error(err)
            message.channel.send('An error has been happened. This is reported.')
            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg counter: \`\`\`${err}\`\`\``)
        } else {
            try{
                var t = new Table
                res.forEach(r=>{
                    var username = client.users.cache.find(u=>u.id == r.user).username
                    if (!username || username == undefined) username = 'Username not found ('+r.user+')'
                    t.cell('User', username)
                    t.cell('Messages', r.nbmessages)
                    t.newRow()
                })
                t.sort(['Messages|des', 'User'])
                t.total('Messages')
                if (t.toString().length>1995){
                    fs.writeFile('./data/cache/custommsg-stat.txt', t.toString(), 'utf8', (err) => {
                        if (err) return function(){
                            console.error(err);
                            message.reply(`FS error: ${err}`)
                        }
                        const attachment = new Discord.MessageAttachment('./data/cache/custommsg-stat.txt')
                        message.reply('Output is more than 2000 characters, see attachment', attachment)
                    })
                } else {
                    message.channel.send('\`\`\`'+t.toString()+'\`\`\`')
                }
            } catch (err) {
                console.error(err)
                message.channel.send('An error has been happened. This is reported.')
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg counter: \`\`\`${err}\`\`\``)
            }
        }
    })
}