const path = require('path');
const createError = require('http-errors');
const download = require('download')
var scriptName = path.basename(__filename).replace('.js', '');

module.exports = function(app, client, config, sql, guild){
    app.get('/guild/'+scriptName, async (req, res, next) => {
        try{
            sql.query("SELECT * FROM jinxs", (err,result)=>{
                if (err) {
                    console.error(err)
                    next(createError(500))
                } else {
                    res.json(result[0])
                }
            })
        } catch (err){
            console.error(err)
            next(createError(500))
        }
    })
}