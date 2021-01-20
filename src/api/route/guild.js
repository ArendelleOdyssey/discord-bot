const path = require('path');
const createError = require('http-errors');
const { format } = require('path');
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql, guild){
    app.get('/'+scriptName, async (req, res, next) => {
        try{
            res.json(await client.guilds.fetch(guild))
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })
    app.get('/'+scriptName+'/banner', async (req, res, next) => {
        try{
            var fetchGuild = await client.guilds.fetch(guild)
            var bannerURL = fetchGuild.bannerURL({format: 'png', size: 4096, dynamic: true})
            if (bannerURL == null) next(createError(404))
            else res.sendFile(bannerURL)
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })
}