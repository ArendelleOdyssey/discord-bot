const Discord = require('discord.js')

module.exports = function(client, message, guild){
    if (client.user.id == config.discord.bot_id){
        if (message.guild.id == guild){ // Check if it's the right server
        var rolesToRemove = [
            '821938205414653953',
            '821938406417367051',
            '821938547853361193',
            '821939017922117672'
        ]
            if (!message.member.roles.cache.some(role => role.id == '730075850740859042')){ // Check if the member has not the role server booster
                message.member.roles.cache.forEach(role => {
                    if (rolesToRemove.includes(role.id)){
                        message.member.roles.remove(role.id, 'Ended his server boost subscription.')
                    }
                });
            }
        }
    }
}