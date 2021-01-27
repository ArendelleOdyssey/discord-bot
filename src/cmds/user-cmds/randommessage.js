const Discord = require('discord.js')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function (client, message, prefix, config, sql){
    if (message.content.toLowerCase() == prefix + 'mentionmessage'){
        sql.query("SELECT `message`, `user` FROM `mention_responses`", (err, result)=>{
            if (err){
                console.error(err)
                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error fetching custom mention msg: \`\`\`${err}\`\`\``)
                message.channel.send(':negative_squared_cross_mark: ' + message.author.username + ', an error has been happened. This is reported.')
            } else {
                var random = randomItem(result)
                message.channel.send(`> ${random.message}\n> - ${random.user}`)
            }
        })
    }
}