const path = require('path');
const createError = require('http-errors');
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql, guild){
    app.get('/'+scriptName+"s", async (req, res, next) => {
        try{
            res.json(client.guild.fetch(guild).channels.cache)
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })
    app.get('/'+scriptName, async (req, res, next) => {
        try{
            res.json({error: {message: "Please set a specific channel: /channel/:ID"}})
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })
    app.get('/'+scriptName+'/:cid', async (req, res, next) => {
        try{
            const c = client.guild.fetch(guild).channels.fetch(req.params.cid)
            if (c.type == 'dm') return next(createError(404))
            res.json(c)
        } catch (err){
            console.error(err)
            if (err.httpStatus == 404) next(createError(404))
            else next(createError(500))
        }
    })
}