const Discord = require('discord.js')
const ig = require('instagram-scraping')

module.exports = function(client, config, old_ig_id){
    setInterval(async function(){
        const iguser = await ig.scrapeUserPage(config.instagram.screen_name)

        if (old_ig_id != undefined && old_ig_id === iguser.medias[0].shortcode) {
            //console.log('[IG] no new posts')
        }
        if (old_ig_id != undefined && old_ig_id !== iguser.medias[0].shortcode) {
            try{
            // New post!
    
            var webhooks = await client.channels.find(c => c.id == config.instagram.post_channel_id).fetchWebhooks()
            var webhook = webhooks.find(wh=> wh.name == 'AO Instagram')
            if (webhook == null){
                await client.channels.find(c => c.id == config.instagram.post_channel_id).createWebhook('AO Instagram', 'https://cdn.discordapp.com/attachments/662735703284908067/773522530425372743/Screen_Shot_2020-07-12_at_10.png')
                webhook = webhooks.find(wh=> wh.name == 'AO Instagram')
                if (webhook == null) return
            }
            
            let embed = new Discord.RichEmbed
    
            embed.setColor(config.instagram.embed_color)
                .setAuthor(iguser.user.full_name, iguser.user.profile_pic_url_hd, `https://instagram.com/p/${iguser.medias[0].shortcode}`)
                .setDescription(iguser.medias[0].text)
                .setImage(iguser.medias[0].display_url)
                .setTimestamp(iguser.medias[0].date)
    
            webhook.send('', {
                username: iguser.user.full_name,
                avatarURL: 'https://cdn.discordapp.com/attachments/662735703284908067/773522530425372743/Screen_Shot_2020-07-12_at_10.png',
                embeds: [embed]
            })
    
            old_ig_id = iguser.medias[0].shortcode
            }catch(e){
                client.channels.find(c => c.id == config.instagram.post_channel_id).send(`https://instagram.com/p/${iguser.medias[0].shortcode}`)
                .catch(err=>console.error(err))
                old_ig_id = iguser.medias[0].shortcode
                console.error(e)
            }
        }
        if (old_ig_id == undefined) {
            old_ig_id = iguser.medias[0].shortcode
        }
    }, config.instagram.check_time * 1000)
}