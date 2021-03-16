const path = require('path');
const createError = require('http-errors');
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
}