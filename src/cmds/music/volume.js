const Discord = require('discord.js')

function volume(message) {
    const embed = new Discord.RichEmbed
    embed.setTitle('How to set the volume in voice chat?')
    embed.setDescription('Right click on the bot and set volume from 0% to 200%.\nOn mobile, long press and set the volume.')
    embed.setImage('https://cdn.discordapp.com/attachments/662045195617042465/673470120819032075/set_volume_voice_chat_Discord.png')
    embed.setColor('RANDOM')
    message.channel.send(embed)
}

module.exports = volume