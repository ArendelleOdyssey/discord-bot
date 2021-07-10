const Discord = require('discord.js');
const os = require('os');
const shell = require('shelljs');

module.exports = async function(message, client, prefix, config, sql) {
    if (message.content.startsWith(prefix + 'about')) {
        message.channel.send('Fetching versions, please wait...').then(m=>{
            var discordjsver = shell.exec('npm view discord.js version', {silent:true}).stdout.replace('\n','')
            if (!discordjsver) var discordjsver = 'not found'
            var nodever = shell.exec('node -v', {silent:true}).stdout.replace('v','').replace('\n','')
            if (!nodever) var nodever = 'not found'
            var sysuptime = shell.exec('uptime --pretty', {silent:true}).stdout.replace('up ','').replace('\n','')
            if (!nodever) var sysuptime = 'not found'

            let totalSeconds = (client.uptime) / 1000;
            let weeks = Math.floor(totalSeconds / 604800)
            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            let aboutembed = new Discord.MessageEmbed()
            aboutembed.setColor("#9C01C4")
            .setTitle('About ' + client.user.tag)
            .addField('Uptime:', `🤖: ${weeks} weeks, ${days} days, ${hours} hours, ${minutes} minutes\n💻: ${sysuptime}`, true)
            .addField("Cast:", 'Greep#3022 (330030648456642562)\n<@330030648456642562>', true)
            .addField('Technical infos:', `Libary: [Discord.js](https://discord.js.org) (Version ${discordjsver})\nNode.js Version: ${nodever}\nOperating System: ${os.type} ${os.release}\nMemory: ${Math.round(os.freemem() / 1024 / 1000)}/${Math.round(os.totalmem() / 1024 / 1000)} MB [${(Math.round(os.freemem() / 1024 / 1000) * 100 / Math.round(os.totalmem() / 1024 / 1000)).toFixed(0)}%] (${client.user.username} : ${Math.round(process.memoryUsage().rss / 1024 / 1000)} MB [${(Math.round(process.memoryUsage().rss / 1024 / 1000) * 100 / Math.round(os.totalmem() / 1024 / 1000)).toFixed(0)}%])`)
            .addField('Parameters:', `__Discord__:\nBot ID: ${client.user.id}\nPrefix: ${prefix}\n\n__Reddit__:\nSubreddit: ${config.reddit.subreddit}\nCheck every: ${config.reddit.check_time} sec`)
            .setThumbnail('https://cdn.mee6.xyz/guild-images/729083124226719816/3369c2df14eed4b8722263445d429fc26b57db5dfe21def534d8018d32797eba.gif')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            message.channel.send(aboutembed).then(m.delete())
        })
    }

    if (message.content.toLowerCase() == prefix + 'bug'){
        let embed = new Discord.MessageEmbed()
        embed.setTitle('Found a bug, or errors in a row ?')
        embed.setDescription(`Don't worry! [Check if it's already listed here](https://github.com/ArendelleOdyssey/discord-bot/issues?q=is%3Aopen+is%3Aissue+label%3Abug).\n\nIf not, [open a issue here!](https://github.com/ArendelleOdyssey/discord-bot/issues/new?assignees=&labels=bug&template=bug_report.md&title=)`)
        message.channel.sned(embed)
    }
    if (message.content.toLowerCase() == prefix + 'feature'){
        let embed = new Discord.MessageEmbed()
        embed.setTitle('Want something new on your lovely bot ?')
        embed.setDescription(`Aww that's cute! [Check if your feature is already listed here](https://github.com/ArendelleOdyssey/discord-bot/issues?q=is%3Aopen+is%3Aissue+label%3A%22Feature+request%22).\n\nIf not, [create your feature request here!](https://github.com/ArendelleOdyssey/discord-bot/issues/new?assignees=&labels=Feature+request&template=feature_request.md&title=)`)
        message.channel.sned(embed)
    }
}