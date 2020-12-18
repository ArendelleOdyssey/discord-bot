const path = require('path');
const createError = require('http-errors');
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql, guild){
    app.get('/'+scriptName, async (req, res, next) => {
        try{
            res.json(client.guilds.cache.get(guild).roles.cache)
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })

    app.get('/'+scriptName+'/:rid', async (req, res, next) => {
        try{
            var r = await client.guilds.cache.get(guild).roles.fetch(req.params.rid)
            if (r == null) return next(createError(404))
            res.json(r)
        } catch (err){
            console.error(err)
            if (err.code == "GUILD_MEMBERS_TIMEOUT") next(createError(504))
            else next(createError(500))
        }
    })
    app.get('/'+scriptName+'/:rid/users', async (req, res, next) => {
        try{
            var list = []
            var r = await client.guilds.cache.get(guild).roles.fetch(req.params.rid)
            r=r.members.array()
            if (r.length == 0) return res.status(204).json({error: {code: 204,message: 'No Content'}});
            res.json(r)
        } catch (err){
            console.error(err)
            if (err.code == "GUILD_MEMBERS_TIMEOUT") next(createError(504))
            else next(createError(500))
        }
    })
}