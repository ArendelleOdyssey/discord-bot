const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const cors = require('cors')

function checkToken(req, res, next, sql, client, guild){
    var auth = req.get('Authorization')
    if (!auth){
        res.status(403).json({error: {code: 403, message: "No Authorization header found, please add a Authorization header. If you don't have one, please contact Greep#3022 directly on discord.gg/arendelleodyssey"}})
    } else {
        if (auth.includes('Token ')){
            var token = auth.replace('Token ', '')
            sql.query("SELECT * FROM `api-token` WHERE token = ?", token, async (err, result)=>{
                if (err){
                    console.error(err)
                    res.status(503).json({error: {code: 503, message: "Error while getting token list for authentificating."}})
                    client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error while getting tokens for API: \`\`\`${err}\`\`\``)
                } else {
                    if (result.length < 1){
                        res.status(401).json({error: {code: 401, message: "Token not found. Please contact Greep#3022 directly on discord.gg/arendelleodyssey if you want one"}})
                    } else {
                        if (result[0].validate == 0){
                            res.status(403).json({error: {code: 403, message: "Your Token is not validated."}})
                        } else {
                            var fetched = await client.guilds.fetch(guild)
                            var userfetched = await fetched.members.fetch(result[0].userId)
                            if (!userfetched){
                                res.status(403).json({error: {code: 403, message: "Your Discord account with the id '"+result[0].userId+"' is not on the Arendelle Odyssey server. Please join discord.gg/arendelleodyssey"}})
                            } else {
                                console.log('[API] Connexion from: '+ userfetched.user.tag)
                                next()
                            }
                        }
                    }
                }
            })
        } else {
            res.status(403).json({error: {code: 403, message: "Token not found in Authorization header, please set a Token in Authorization header. If you don't have one, please contact Greep#3022 directly on discord.gg/arendelleodyssey"}})
        }
    }
}

module.exports = function(client, config, sql, guild){

    const app = express() 
    var port // Custom port will be proxied by apache2's module "proxy_http" to its domain
    if (client.user.id == config.discord.bot_id){
        port = 8080
    } else if (client.user.id == config.discord.bot_id_beta) {
        port = 8081
    }
    
    app.disable('etag');
    app.use(logger('[API log] (:date) :method :url - ":user-agent" (:remote-addr) - :status :response-time ms'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors())

    // User-agent blacklist system
    app.use(function(req, res, next){
        var ua = req.get('User-Agent')
        if (!ua){
            res.status(403).json({error: {code: 403, message: "No User-Agent found, please add a user-agent to something I can understand!"}})
        } else {
            var blacklistUA = JSON.parse(fs.readFileSync(path.join(__dirname, 'user-agent-blacklist.json')))
            var blacklisted = false
    
            blacklistUA.forEach(bUA=>{
                if (ua.toLowerCase().includes(bUA.toLowerCase())){
                    blacklisted = true
                }
            })
    
            if (blacklisted) {
                console.log('[API] BLACKLISTED UA: ' + ua)
                res.status(403).json({error: {code: 403, message: "Your User-Agent '"+ ua +"' is blacklisted, please change it to something I can understand!"}})
            } else {
                next()
            }
        }
    })

    app.get('/', (req, res) => {
        res.json({'online': true})
    })
    app.get('/static', (req, res)=>{
        var list = []
        fs.readdirSync(path.join(__dirname, 'static')).forEach(function(file) {
            list.push(file.replace('.html', ''))
        });
        res.json(list)
    })
    app.get('/static/:page', (req, res)=>{
        res.send(fs.readFileSync(path.join(__dirname, 'static', req.params.page+'.html'), 'utf-8'));
    })

    app.use(express.json());

    // Set pages for pages that does not require token
    fs.readdirSync(path.join(__dirname, 'route', 'noToken')).filter(file => file.endsWith('.js')).forEach(function(file) {
        require(path.join(__dirname, 'route', 'noToken', file))(app, client, config, sql, guild)
    });

    // Set pages for dev folder
    fs.readdirSync(path.join(__dirname, 'route', 'dev')).filter(file => file.endsWith('.js')).forEach(function(file) {
        require(path.join(__dirname, 'route', 'dev', file))(app, client, config, sql, guild)
    });

    // Set pages that require token
    app.use((req,res,next)=>checkToken(req,res,next,sql, client, guild))
    fs.readdirSync(path.join(__dirname, 'route', 'token')).filter(file => file.endsWith('.js')).forEach(function(file) {
        require(path.join(__dirname, 'route', 'token', file))(app, client, config, sql, guild, checkToken)
    });


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        // render the error page
        res.status(err.status || 500).json({
            error: {
                code: err.status || 500,
                message: err.message
            }
        });
    });
    
    app.listen(port, () =>{
        console.log(`Status/API server running on port ${port}`)
    })
}