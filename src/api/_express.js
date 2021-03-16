const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const cors = require('cors')

module.exports = function(client, config, sql, guild){

    const app = express() 
    var port // Custom port will be proxied by apache2's module "proxy_http" to its domain
    if (client.user.id == config.discord.bot_id){
        port = 8080
    } else if (client.user.id == config.discord.bot_id_beta) {
        port = 8081
    }
    
    app.disable('etag');
    app.use(logger('dev'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors())

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

    // Set pages
    fs.readdirSync(path.join(__dirname, 'route')).filter(file => file.endsWith('.js')).forEach(function(file) {
        require(path.join(__dirname, 'route', file))(app, client, config, sql, guild)
    });

    // Set pages for dev folder
    fs.readdirSync(path.join(__dirname, 'route', 'dev')).filter(file => file.endsWith('.js')).forEach(function(file) {
        require(path.join(__dirname, 'route', 'dev', file))(app, client, config, sql, guild)
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