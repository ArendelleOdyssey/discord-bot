const Discord = require('discord.js')
const Twitter = require('twit')

module.exports = async function(client, message, prefix, config){

    if (message.content.toLowerCase().startsWith(prefix + 'sendlasttweet')){
        if (message.member.roles.cache.some(role => role.id == '729083781062983702')){
            const twitter_tokens = {
                consumer_key:        config.twitter.consumer_key,
                consumer_secret:     config.twitter.consumer_secret,
                access_token:        config.twitter.access_token_key,
                access_token_key:    config.twitter.access_token_key,
                access_token_secret: config.twitter.access_token_secret
            };
            const twitter_client = new Twitter(twitter_tokens)
    
            twitter_client.get('statuses/user_timeline', { screen_name: config.twitter.screen_name }, async (err, tweets) => {
                try{
                    if (err) client.shard.send(err);
                    var con_header = `[Twitter] `
                    
                    let embed = new Discord.MessageEmbed
    
                    var webhooks = await client.channels.cache.find(c => c.id == config.twitter.post_channel_id).fetchWebhooks()
                    var webhook = webhooks.find(wh=> wh.name == 'AO Twitter')
                    if (webhook == null){
                        await client.channels.cache.find(c => c.id == config.twitter.post_channel_id).createWebhook('AO Twitter', 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png')
                        webhook = webhooks.find(wh=> wh.name == 'AO Twitter')
                        if (webhook == null) return
                    }
    
                    tweets[0].text.replace('&amp;', '&')
    
                    if (tweets[0].retweeted === true || tweets[0].text.startsWith('RT')) {
                        if (config.twitter.retweet === true){
                            if (tweets[0].retweeted_status.user.id_str == result.id_str) return
                            console.log(con_header + `Retweet from @${tweets[0].retweeted_status.user.screen_name}`)
                            embed.setColor(config.twitter.embed_color ? config.twitter.embed_color : 'RANDOM')
                                .setAuthor(`Retweet\n${tweets[0].retweeted_status.user.name} (@${tweets[0].retweeted_status.user.screen_name})`, tweets[0].retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                .setDescription(tweets[0].retweeted_status.text)
                                .setTimestamp(tweets[0].retweeted_status.created_at)
                                .setThumbnail('https://img.icons8.com/color/96/000000/retweets[0].png')
                            if (tweets[0].retweeted_status.entities.media) embed.setImage(tweets[0].retweeted_status.entities.media[0].media_url_https)
                            if (client.channels.cache.some(c => c.id == config.twitter.post_channel_id)) {
                                webhook.send('', {
                                    username: tweets[0].user.name,
                                    avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png',
                                    embeds: [embed]
                                })
                                message.channel.send(`The last tweet was a retweet with from @${tweets[0].retweeted_status.user.screen_name}, it was sent to <#${config.twitter.post_channel_id}>`)
                            } else return
                        } else {
                            console.log(con_header + `Retweet from @${tweets[0].retweeted_status.user.screen_name}, but retweet config is disabled`)
                            message.channel.send(`The last tweet was a retweet, but retweet config is disabled`)
                        }
                    } else if (tweets[0].retweeted === false || !tweets[0].text.startsWith('RT')) {
                        if (tweets[0].in_reply_to_status_id == null || tweets[0].in_reply_to_user_id == null) {
                            console.log(con_header + `Simple tweet, id ${tweets[0].id_str}`)
                            embed.setColor(config.twitter.embed_color ? config.twitter.embed_color : 'RANDOM')
                                .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                .setDescription(tweets[0].text)
                                .setTimestamp(tweets[0].created_at)
                            if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                            if (client.channels.cache.some(c => c.id == config.twitter.post_channel_id)) {
                                webhook.send('', {
                                    username: tweets[0].user.name,
                                    avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png',
                                    embeds: [embed]
                                })
                                message.channel.send(`The last tweet was sent to <#${config.twitter.post_channel_id}>`)
                            } else return
                        } else if (tweets[0].in_reply_to_status_id != null || tweets[0].in_reply_to_user_id != null){
                            if (config.twitter.reply === false){
                                console.log(con_header + `Reply to a tweet, but reply option is off`)
                                message.channel.send(`The last tweet was a reply, but reply option is off`)
                            } else {
                                console.log(con_header + `Reply to a tweet, id ${tweets[0].in_reply_to_status_id}`)
                                embed.setColor(config.twitter.embed_color ? config.twitter.embed_color : 'RANDOM')
                                    .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})\nReply to @${tweets[0].in_reply_to_screen_name}`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                    .setDescription(tweets[0].text.replace(`@${tweets[0].in_reply_to_screen_name}`, ""))
                                    .setTimestamp(tweets[0].created_at)
                                    .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                                if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                                if (client.channels.cache.some(c => c.id == config.twitter.post_channel_id)) {
                                    webhook.send('', {
                                        username: tweets[0].user.name,
                                        avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png',
                                        embeds: [embed]
                                    })
                                    message.channel.send(`The last tweet was a reply to @${tweets[0].in_reply_to_screen_name}, it was sent to <#${config.twitter.post_channel_id}>`)
                                } else return
                            }
                        }
                    }
                } catch(e){
                    console.log(`[twt-stream] ERROR: `,e)
                    console.log(tweets[0])
                }
            });
        } else message.react('❌')
    }
}