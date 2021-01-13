const Discord = require('discord.js')
const fetch = require('node-fetch')

async function getUserAvatar(screen_name){
    const url = `https://www.reddit.com/user/${screen_name}/about.json`
    var res = await fetch(url)
    var json = await res.json()
    var resData = json.data

    var avatar = 'https://www.redditinc.com/assets/images/site/reddit-logo.png'

    if (!resData.snoovatar_img || resData.snoovatar_img == ""){
        if (!resData.icon_img || resData.icon_img == ""){
            avatar = 'https://www.redditinc.com/assets/images/site/reddit-logo.png'
        } else  {
            avatar = resData.icon_img
        }
    } else {
        avatar.snoovatar_img
    }
    return avatar
}

module.exports = async function(client, message, prefix, config){

    if (message.content.toLowerCase().startsWith(prefix + 'sendlastreddit')){
        if (message.member.roles.cache.some(role => role.id == '729083781062983702')){
            const url = `https://www.reddit.com/r/${config.reddit.subreddit}/new.json?limit=0`
            var res = await fetch(url)
            var json = await res.json()
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
                .setAuthor(`u/${resData.author}`, await getUserAvatar(resData.author))
                .setTitle(resData.title.substring(0, 250))
                .setDescription(`${resData.selftext.length >= 1800 ? resData.selftext.substring(0,1800)+'...' : resData.selftext}${resData.selftext.length < 0 ? `` : `\n\n`}[Open link](https://reddit.com${resData.permalink})`)
                if(resData.post_hint == 'image') embed.setImage(resData.url)
                embed.setFooter((!resData.link_flair_text ? '' : resData.link_flair_text+' - ')+'By u/'+resData.author+resData.author_flair_text !== null ? ` [${resData.author_flair_text}]` : '')

            webhook.send('', {
                username: resData.subreddit_name_prefixed,
                embeds: [embed]
            })

            message.channel.send('The last reddit post was sent on <#'+config.reddit.post_channel_id+'>')
        } else message.react('❌')
    }
}