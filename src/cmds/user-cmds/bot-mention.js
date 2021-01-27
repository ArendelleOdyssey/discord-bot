const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, prefix, config, sql){
    if (message.content.toLowerCase().startsWith(prefix + 'mention')){
        let args = message.content.split(" ");
        args.shift();
        if (args.length < 1) {
            let embed = new Discord.MessageEmbed
            embed.setColor('RANDOM')
            .setTitle('Custom text when you mention ' + client.user.username)
            .setDescription(`${client.user.username} can respond with a random custom message defined by yourself when you mention the bot at the beginning on a message.`)
            .addField('To set it up:', `\`${prefix}mention add [message]\` - Create and store your custom message, it will return an ID that it will be useful for removing the message. You can create unlimited messages, the bot will return a random message`)
            .addField('Removing a message', `\`${prefix}mention remove [ID]\` - Removes the message with the ID, it will be deleted from the bot\'s database`)
            .addField('List your messages:', `\`${prefix}mention list\` - The bot will send you a DM with a file containig all the messages you registed *(GDPR)*`)
            message.channel.send(embed)
        } else if (args[0].toLowerCase() == 'add'){
            args.shift()
            if (args.length < 1) return message.channel.send(message.author.username + ', I need a message!')
            if (message.mentions.users.first() != undefined || message.mentions.roles.first() != undefined || message.mentions.members.first() != undefined) return message.channel.send(message.author.username + ', I\'ll not mention a user or a role!')
            if (message.mentions.everyone) return message.channel.send(message.author.username + ', I\'ll not mention everyone or here!')
            var usrMsg = args.join(' ')
            usrMsg = usrMsg.replace("'", "`")
            sql.query("INSERT INTO `mention_responses` (`user`, `message`, `command-name`) VALUES (?, ?, ?)",[message.author.id, usrMsg, message.author.username.split(' ').join('')] , (err, result)=>{
                if (err){
                    console.error(err)
                    if (err.code == 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'){
                        message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', Incorrect format. Please check your message and retry.')
                    } else {
                        message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error adding custom mention msg: \`\`\`${err}\`\`\``)
                    }
                } else {
                  message.channel.send(':white_check_mark: ' + message.author.username + `, your message has been added! The ID of this message is \`${result.insertId}\``)
                }
            })
        } else if (args[0].toLowerCase() == 'remove'){
            args.shift()
            if (args.length < 1) return message.channel.send(message.author.username + ', I need the ID!')
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                sql.query("DELETE FROM `mention_responses` WHERE `id` = ?", args[0], (err, result)=>{
                    if (err){
                        console.error(err)
                        message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error removing custom mention msg: \`\`\`${err}\`\`\``)
                    } else {
                        if (result.affectedRows == 0) {
                            message.channel.send(':negative_squared_cross_mark: Invalid ID or unauthorised')
                        } else {
                            message.channel.send(':white_check_mark: ' + message.author.username + `, message #${args[0]} has been removed!`)
                        }
                    }
                })
            } else {
                sql.query("DELETE FROM `mention_responses` WHERE `id` = ? AND `user` = ?", [args[0], message.author.id], (err, result)=>{
                    if (err){
                        console.error(err)
                        message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error removing custom mention msg: \`\`\`${err}\`\`\``)
                    } else {
                        if (result.affectedRows == 0) {
                            message.channel.send(':negative_squared_cross_mark: Invalid ID or unauthorised')
                        } else {
                            message.channel.send(':white_check_mark: ' + message.author.username + `, your message #${args[0]} has been removed!`)
                        }
                    }
                })
            }
        } else if (args[0].toLowerCase() == 'list'){
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                sql.query("SELECT * FROM `mention_responses`", (err, result)=>{
                    if (err){
                      console.error(err)
                      message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                      client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
                    } else {
                        var list = []
                        result.forEach(r=>{
                            list.push(r.id + ' - ' + r.user + '(' + r['command-name'] + ')' + ' - ' + r.message)
                        })
                        fs.writeFileSync('./data/cache/mention-messages.txt', list.join('\n'))
                        let attachment = new Discord.MessageAttachment('./data/cache/mention-messages.txt')
                        message.author.send('Your messages\nFormat: \`Message ID - User ID (Command name) - Message\` - The message will be deleted in 24 hours', attachment).then(m=>{
                            message.channel.send(message.author.username + ', I\'ve sent the list on your DM')
                            m.delete(24*60*60*1000)
                        }).catch(e=>{
                            console.error(e)
                            message.channel.send('I cannot send DM to you, check if you have enabled Direct Messages from this server in Privacy Settings')
                        })
                    }
                })
            } else {
                sql.query("SELECT * FROM `mention_responses` WHERE `user` = ?", message.author.id, (err, result)=>{
                    if (err){
                      console.error(err)
                      message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
                      client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
                    } else {
                        var list = []
                        result.forEach(r=>{
                            list.push(r.id + ' - ' + r.message)
                        })
                        fs.writeFileSync('./data/cache/mention-messages.txt', list.join('\n'))
                        let attachment = new Discord.MessageAttachment('./data/cache/mention-messages.txt')
                        message.author.send('Your messages\nFormat: \`Message ID - Message\` - The message will be deleted in 24 hours', attachment).then(m=>{
                            message.channel.send(message.author.username + ', I\'ve sent the list on your DM')
                            m.delete(24*60*60*1000)
                        }).catch(e=>{
                            console.error(e)
                            message.channel.send('I cannot send DM to you, check if you have enabled Direct Messages from this server in Privacy Settings')
                        })
                    }
                })
            }
        } else return message.react('❎')
    }
    if (message.content.toLowerCase().startsWith(`<@${client.user.id}>`) || message.content.toLowerCase().startsWith(`<@!${client.user.id}>`)){
        sql.query("SELECT `message` FROM `mention_responses` WHERE `user` = ?", message.author.id, (err, result)=>{
            if (err){
                console.error(err)
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
            } else {
                var messages = []
                result.forEach(r=>messages.push(r.message))
                if (messages.length < 1) return
                message.channel.send(randomItem(messages))
            }
        })
    }
}