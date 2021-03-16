const path = require('path');
const createError = require('http-errors');
const download = require('download')
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql, guild){
    app.get('/guild/'+scriptName, async (req, res, next) => {
        try{
            var fetchGuild = await client.guilds.fetch(guild)
            var bannerURL = fetchGuild.bannerURL({format: 'png', size: 4096, dynamic: true})
            if (bannerURL == null) next(createError(404))
            else {
                download(bannerURL, './data/cache', {filename: 'guild_banner.png'})
                .then(function(){
                    // send image
                    res.sendFile(process.cwd() + '/data/cache/guild_banner.png')
                })
            }
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })
}