const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = function(client, config){
    const url = `https://www.reddit.com/r/${config.reddit.subreddit}/new.json?limit=0`
    var oldpost = undefined
    setInterval(async function(){
        var res = await fetch(url)
        var json = await res.json()
        if(oldpost != undefined && oldpost != json.data.children[0].data.id){
            oldpost = json.data.children[0].data.id
            var resData = json.data.children[0].data

            let embed = new Discord.MessageEmbed

            var webhooks = await client.channels.cache.find(c => c.id == config.reddit.post_channel_id).fetchWebhooks()
            var webhook = webhooks.find(wh=> wh.name == 'AO Reddit')
            if (webhook == null){
                await client.channels.cache.find(c => c.id == config.reddit.post_channel_id).createWebhook('AO Reddit', client.user.displayAvatarURL())
                webhook = webhooks.find(wh=> wh.name == 'AO Reddit')
                if (webhook == null) return
            }

            embed.setColor(config.reddit.embed_color)
                .setAuthor(`u/${resData.author}${resData.author_flair_text !== null ? ` (${resData.author_flair_text})` : ''}`)
                .setTitle(resData.title.substring(0, 250))
                .setDescription(`${resData.selftext.length >= 1800 ? resData.selftext.substring(0,1800)+'...' : resData.selftext}${resData.selftext.length < 0 ? `` : `\n\n`}[Open link](https://reddit.com${resData.permalink})`)
                if(resData.post_hint == 'image') embed.setImage(resData.url)
                embed.setTimestamp(resData.created_utc)

            webhook.send('', {
                username: resData.subreddit_name_prefixed,
                embeds: [embed]
            })
        } else if (oldpost == undefined) {
            oldpost = json.data.children[0].data.id
        }
    }, config.reddit.check_time * 1000)
}