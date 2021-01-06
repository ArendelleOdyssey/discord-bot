const Discord = require('discord.js')
var youtube = require('youtube-api')
const wait = require('util').promisify(setTimeout);
module.exports = function(client, config){
    try{

        wait(1000)
        var old_yt_id = undefined

        youtube.authenticate({
            type: 'key',
            key: config.youtube.apikey,
        });

        youtube.search.list({
            type: 'video',
            part: 'snippet',
            pageToken: null,
            maxResults: 1,
            order: 'date',
            channelId: config.youtube.channelID,
        }, function(err, data) {
            if (err) {
                console.error('[YT] Fetch error: ', err);
                // client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on youtube fetch api: \`\`\`${err}\`\`\``)
                return
            }
            data.data.items.forEach(async i=>{
                console.log('[YT] Setting videoID var')
                old_yt_id = i.id.videoId
            })
        });

        setInterval(function(){
            youtube.search.list({
                type: 'video',
                part: 'snippet',
                pageToken: null,
                maxResults: 1,
                order: 'date',
                channelId: config.youtube.channelID,
            }, function(err, data) {
                if (err) {
                    console.error('[YT] Fetch error: ', err);
                    // client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on youtube fetch api: \`\`\`${err}\`\`\``)
                    return
                }
                data.data.items.forEach(async i=>{
                    if (old_yt_id != undefined && old_yt_id === i.id.videoId) {
                        console.log('[YT] no new posts')
                    } else if (old_yt_id != undefined && old_yt_id !== i.id.videoId){
                        console.log('[YT] new post!')
    
                        var webhooks = await client.channels.cache.find(c => c.id == config.youtube.post_channel_id).fetchWebhooks()
                        var webhook = webhooks.find(wh=> wh.name == 'AO Youtube')
                        if (webhook == null){
                            await client.channels.cache.find(c => c.id == config.youtube.post_channel_id).createWebhook('AO Youtube', 'https://cdn.discordapp.com/attachments/662735703284908067/785229698732654612/Screen_Shot_2020-07-13_at_10.png')
                            webhook = webhooks.find(wh=> wh.name == 'AO Youtube')
                            if (webhook == null) return
                        }
    
                        let embed = new Discord.MessageEmbed
                        embed   .setColor(config.youtube.embed_color)
                                .setAuthor('New video!', client.user.displayAvatarURL(), `https://www.youtube.com/watch?v=${i.id.videoId}`)
                                .setDescription(`[**${i.snippet.title}**](https://www.youtube.com/watch?v=${i.id.videoId})\n\n${i.snippet.description}`)
                                .setImage(i.snippet.thumbnails.high.url)
    
                        webhook.send(`https://www.youtube.com/watch?v=${i.id.videoId}`, {
                            username: i.snippet.channelTitle,
                            avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/785229698732654612/Screen_Shot_2020-07-13_at_10.png',
                            embeds: [embed]
                        })
                        old_yt_id = i.id.videoId
                    } else if (old_yt_id == undefined) {
                        console.log('[YT] videoID is not defined, setting it up')
                        old_yt_id = i.id.videoId
                    }
                })
            });
        }, config.youtube.check_time * 1000)
    } catch (err) {
        console.error(err)
        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on youtube streaming api: \`\`\`${err}\`\`\``)
    }
}