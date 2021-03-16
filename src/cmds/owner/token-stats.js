const Discord = require('discord.js');

module.exports = function(message, client, prefix, sql) {
    if (message.content.startsWith(prefix + 'tokenstat')) {
        message.delete()
        const args = message.content.split(" ").slice(1);
        if (args.length < 1) return message.reply(prefix+'tokenstat [token]').then(m=>m.delete(10000))

        sql.query("SELECT * FROM `api-token` WHERE token = ?", args[0], async (err,res)=>{
            if (err){
                console.error(err)
                message.author.send(`:warning: Error while getting tokens for API: \`\`\`${err}\`\`\``)
            }else{
                var user = await client.users.fetch(res[0].userId)
                let embed = new Discord.MessageEmbed()
                embed.setTitle('Token Information')
                .setDescription('**__Description__**:\n'+res[0].description)
                .addField('Token:', `\`${res[0].token}\``)
                .addField('User:', user.tag)
                .addField('Activated:', res[0].validate == 1 ? 'Yes' : 'No')
                .setFooter('ID: ' + res[0].id)

                message.author.send(embed)
            }
        })
    }
}