const Discord = require('discord.js')
const Twitter = require('twitter-lite')

module.exports = async function(twitter_client, client, config, sql){

    var result = await twitter_client.get('users/show', { screen_name: config.twitter.screen_name })
    .catch(err => {
        console.log(`Twitter User GET request error for ${config.twitter.screen_name}: ` + err.errors[0].message + ' - ' + err.errors[0].code);
        console.log(err)
        if (err.errors[0].code == 50 || err.errors[0].code == 63 || err.errors[0].code == 32) {
            console.error('Twitter account not found!')
        }
        return
    })

    if (!result.id_str) return console.log('Twitter Streaming error: unable to find ID of ' + config.twitter.screen_name)
    const Tstream = twitter_client.stream("statuses/filter", { follow: result.id_str })

    Tstream.on('start', function(start_result) {
        if (start_result.status == 200){
            console.log(`🟢 Twitter streaming API started - Watching ${config.twitter.screen_name} (ID: ${result.id_str})`)
            sql.query("UPDATE `twitter_status` SET `isOnline` = 1 WHERE `twitter_status`.`isOnline` = 0", (err, res)=>{
                if (err) console.error(err)
            })
        }
        else console.log(start_result.statusText)
    })
    Tstream.on("end", async response => {
        console.log(`🔴 Twitter streaming API ended`)
        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Twitter Streaming API ended`)
        sql.query("UPDATE `twitter_status` SET `isOnline` = 0 WHERE `twitter_status`.`isOnline` = 1", (err, res)=>{
            if (err) console.error(err)
        })
    });
    Tstream.on('data', async function(tweet) {
        try {
            if (!tweet.text || tweet.text == '') return
            var con_header = `[Twitter] `

            let embed = new Discord.MessageEmbed

            var webhooks = await client.channels.cache.find(c => c.id == config.twitter.post_channel_id).fetchWebhooks()
            var webhook = webhooks.find(wh=> wh.name == 'AO Twitter')
            if (webhook == null){
                await client.channels.cache.find(c => c.id == config.twitter.post_channel_id).createWebhook('AO Twitter', 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png')
                webhook = webhooks.find(wh=> wh.name == 'AO Twitter')
                if (webhook == null) return
            }
            

            tweet.text.replace('&amp;', '&')
            if (tweet.retweeted === true || tweet.text.startsWith('RT')) {
                if (config.twitter.retweet === true) {
                    if (tweet.retweeted_status.user.id_str == result.id_str) return
                    console.log(con_header + `Retweet from @${tweet.retweeted_status.user.screen_name}`)
                    embed.setColor(config.twitter.embed_color ? config.twitter.embed_color : 'RANDOM')
                        .setAuthor(`Retweet\n${tweet.retweeted_status.user.name} (@${tweet.retweeted_status.user.screen_name})`, tweet.retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                        .setDescription(tweet.retweeted_status.text)
                        .setTimestamp(tweet.retweeted_status.created_at)
                        .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                    if (tweet.retweeted_status.entities.media) embed.setImage(tweet.retweeted_status.entities.media[0].media_url_https)
                    if (client.channels.cache.some(c => c.id == config.twitter.post_channel_id)) {
                        webhook.send('', {
                            username: tweet.user.name,
                            avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png',
                            embeds: [embed]
                        })
                    } else return
                } else {
                    console.log(con_header + `Retweet from @${tweet.retweeted_status.user.screen_name}, but retweet config is disabled`)
                }
            } else if (tweet.retweeted === false || !tweet.text.startsWith('RT')) {
                if (tweet.in_reply_to_status_id == null || tweet.in_reply_to_user_id == null) {
                    console.log(con_header + `Simple tweet, id ${tweet.id_str}`)
                    embed.setColor(config.twitter.embed_color ? config.twitter.embed_color : 'RANDOM')
                        .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                        .setDescription(tweet.text)
                        .setTimestamp(tweet.created_at)
                    if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                    if (client.channels.cache.some(c => c.id == config.twitter.post_channel_id)) {
                        webhook.send('', {
                            username: tweet.user.name,
                            avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png',
                            embeds: [embed]
                        })
                    } else return
                } else if (tweet.in_reply_to_status_id != null || tweet.in_reply_to_user_id != null) {
                    if (config.twitter.reply === false) {
                        console.log(con_header + `Reply to a tweet, but reply option is off`)
                    } else {
                        console.log(con_header + `Reply to a tweet, id ${tweet.in_reply_to_status_id}`)
                        embed.setColor(config.twitter.embed_color ? config.twitter.embed_color : 'RANDOM')
                            .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})\nReply to @${tweet.in_reply_to_screen_name}`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                            .setDescription(tweet.text.replace(`@${tweet.in_reply_to_screen_name}`, ""))
                            .setTimestamp(tweet.created_at)
                            .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                        if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                        if (client.channels.cache.some(c => c.id == config.twitter.post_channel_id)) {
                            webhook.send('', {
                                username: tweet.user.name,
                                avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773131257311395900/Screen_Shot_2020-07-13_at_12.png',
                                embeds: [embed]
                            })
                        } else return
                    }
                }
            }
        } catch (e) {
            console.log(`[twt-stream] ERROR: `,e)
            console.log(tweet)
        }
    })
    Tstream.on('error', function(err) {
        console.log(`globaltwit stream error:`)
        console.log(err)
        sql.query("UPDATE `twitter_status` SET `isOnline` = 0 WHERE `twitter_status`.`isOnline` = 1", (err, res)=>{
            if (err) console.error(err)
        })
    })
    Tstream.on('stall_warnings', function(stall) {
        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: ${stall.warning.message}`)
        console.log(`${stall.warning.message} - ` + stall.warning.code)
    })
}