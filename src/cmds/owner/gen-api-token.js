const Discord = require('discord.js');
const hat = require('hat');

function generateToken(){
    var token = hat(128, 16)
    return token;
}

function checkToken(message, client, token, sql, member, description, createMsg){
    sql.query("SELECT * FROM `api-token` WHERE token = ?", token, async (err, result)=>{
        if (err){
            console.error(err)
            message.author.send(`:warning: Error while getting tokens for API: \`\`\`${err}\`\`\``)
        } else {
            if (result.length < 1){
                addToken(message, client, token, sql, member, description, createMsg)
            } else {
                token = generateToken()
                checkToken(message, client, token, sql, member, description, createMsg)
            }
        }
    })
}


function addToken(message, client, token, sql, member, description, createMsg){
    sql.query("INSERT INTO `api-token` (`userId`, `token`, `description`, `validate`) VALUES (?, ?, ?, 1)", [member.user.id, token, description], async (err, res)=>{
        createMsg.delete()
        if (err){
            console.error(err)
            message.author.send(`:warning: Error while insert tokens for API: \`\`\`${err}\`\`\``)
        }else{
            message.author.send('Token: `'+token+'`.')

            var sendmsg = await message.author.send('Send to '+member.displayName+'?')
            sendmsg.react('✅').then(() => sendmsg.react('❌'));

            const filter = (reaction, user) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            sendmsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected=>{
                const reaction = collected.first();
                if (reaction.emoji.name === '✅') {
                    member.user.send('Here\'s your token: `'+token+'`\nTo use it: add this header on your request: `Authorization: Token '+token+'`')
                    .then(()=>{
                        sendmsg.edit('Sent!')
                        sendmsg.delete(30000)
                    })
                    .catch(err=>{
                        sendmsg.edit('I cannot send, do it yourself :/')
                    })
                } else {
                    sendmsg.delete();
                }
            })
        }
    })
}

module.exports = async function(message, client, prefix, sql) {
    if (message.content.startsWith(prefix + 'generateAPItoken')) {
        try {
            const args = message.content.split(" ").slice(1);
            
            if (args.length < 1){
                return message.reply(prefix+'generateAPItoken [@user] [description]')
            }

            var member = message.guild.member(message.mentions.users.first())
            if (!member){
                return message.reply('User not found');
            } else {
                args.shift()
                if (args.length < 1){
                    return message.reply('Add a description')
                }
                var description = args.join(' ')
                var createMsg = await message.channel.send('Please wait... Generating token and checking...')
                var token = generateToken()
                checkToken(message, client, token, sql, member, description, createMsg)
            }
        } catch (err) {
            message.author.send(err);
        }
    }
}