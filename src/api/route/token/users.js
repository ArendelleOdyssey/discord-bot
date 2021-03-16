const path = require('path');
const createError = require('http-errors');
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql, guild){
    app.get('/'+scriptName, async (req, res, next) => {
        try{
            res.json(client.guilds.cache.get(guild).members.cache)
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })

    app.get('/'+scriptName+'/:uid', async (req, res, next) => {
        try{
            var r = await client.guilds.cache.get(guild).members.fetch(req.params.uid)
            var u = await client.users.fetch(req.params.uid)
            var avatar = await u.avatarURL({dynamic: true})
            res.json({member: r, user: u, avatarURL: avatar})
        } catch (err){
            console.error(err)
            if (err.httpStatus == 404) next(createError(404))
            else if (err.code == "GUILD_MEMBERS_TIMEOUT") next(createError(504))
            else next(createError(500))
        }
    })

    app.get('/'+scriptName+'/:uid/roles', async (req, res, next) => {
        try{
            client.guilds.fetch(guild).then(g=>{
                g.members.fetch(req.params.uid).then(m=>{
                    res.json(m.roles.cache)
                })
            })
            
        } catch (err){
            console.error(err)
            if (err.httpStatus == 404) next(createError(404))
            else if (err.code == "GUILD_MEMBERS_TIMEOUT") next(createError(504))
            else next(createError(500))
        }
    })
}