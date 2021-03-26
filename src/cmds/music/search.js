const Discord = require('discord.js')
const ytsr = require('ytsr')

module.exports = async function(message, prefix){
    let args = message.content.split(' ');
    args.shift();

    if (args.length < 1) return message.reply('Usage: \`'+prefix+'search [query]\`, it will returns results.')

    const filters1 = await ytsr.getFilters(args.join(' '))
    const filter1 = filters1.get('Type').get('Video');
    const filters2 = await ytsr.getFilters(filter1.url)
    const filter2 = filters2.get('Duration').get('Short (< 4 minutes)');
    const filters3 = await ytsr.getFilters(filter2.url)
    const filter3 = filters3.get('Sort By').get('Relevance');
    var options = {
        limit: 15
    }
    var searchResults = await ytsr(filter3.url, options)

    if (searchResults.items.length < 1) return message.channel.send('Nothing found, try something else')

    var strArray = []
    searchResults.items.forEach(element => {
        strArray.push(`- [${element.title}](${element.url}) \`${element.id}\``)
    });

    let embed = new Discord.MessageEmbed()
    embed.setTitle('Results for ' + args.join(' '))
    .setDescription('*To add your song in the player, select the id in the code block and put in the play command. Example: \`'+prefix+'p AOeY-nDp7hI\`*\n\n'+strArray.join('\n'))
    message.channel.send(embed)
}