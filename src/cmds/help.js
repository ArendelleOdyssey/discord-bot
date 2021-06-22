const Discord = require('discord.js')
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(client, message, prefix, config){
    if (message.content.toLowerCase().startsWith(prefix + 'help')){
        const randommsgs = JSON.parse(fs.readFileSync('./data/help_greet_user.json'))
        let randommsg = randomItem(randommsgs)
    
        let embed = new Discord.MessageEmbed()
    
        embed.setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor('#000F42')
        .setDescription(`Hey ${message.author.username}! ` + randommsg + '\nAnyway, here\'s some commands!')
    
        embed.addField(prefix + 'sots', 'Spirit of Two Sisters...', true)
        embed.addField(prefix + 'mention', 'Custom responses when you mention the bot', true)
        embed.addField(prefix + 'quote', 'Get a random message of a random traveller on AO', true)
        embed.addField(prefix + 'customlist', 'List of commands user\'s custom responses', true)
        embed.addField(prefix + 'jinxs', 'See the Jinxs! counter', true)
        embed.addField(prefix + 'bug / '+prefix+'feature', 'Report a bug or suggest a new feature!', true)
        if (config.twitter.posters.includes(message.author.id)) embed.addField(prefix + 'tweet', 'Post a tweet to Arendelle Odyssey Twitter', true)
        if (message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(role => role.name.toLowerCase() == 'giveaway host')) embed.addField(prefix + 'giveaway', '[Mods/Giveaway Hosters] Host a new giveaway or manage existing giveaways', true)
        if (message.member.hasPermission('MANAGE_MESSAGES')) embed.addField(prefix + 'stat', '[Mods] Get stats about the bot', true)
        if (message.member.roles.cache.some(role => role.id == '729083781062983702'))  embed.addField(prefix + 'sendlasttweet', `[ST] Send latest tweet to <#${config.twitter.post_channel_id}>`, true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'update', '[Owner] Update the bot from git repo', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'eval', '[Owner] Evaluate JS', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'ssh', '[Owner] Evaluate shell command', true)
        if (message.author.id == config.discord.owner_id) embed.addField(prefix + 'sql', '[Owner] Evaluate SQL command in bot\'s database', true)

        message.channel.send(embed)
    }
}