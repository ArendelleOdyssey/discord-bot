const Discord = require('discord.js')

module.exports = function(client, message, prefix, config, sql){

    require('./help.js')(client, message, prefix, config)
    require('./about.js')(message, client, prefix, config, sql)

    // user-cmds
    require('./user-cmds/bot-mention.js')(client, message, prefix, config, sql)
    require('./user-cmds/custom-user-commands.js')(client, message, prefix, config, sql)
    require('./user-cmds/custom-commands-list.js')(client, message, prefix, config, sql)
    require('./user-cmds/quote.js')(client, message, prefix, config, sql)

    // Twitter integration
    require('./twitter/tweet.js')(client, message, prefix, config)
    require('./twitter/last-tweet.js')(client, message, prefix, config)

    // Reddit integration
    require('./reddit/last-reddit.js')(client, message, prefix, config)

    // AO managment commands
    require('./mods/stats/_stats-index.js')(message, client, prefix, config, sql)
    //require('./mods/embed-announcement.js')(message, client, prefix, config)
    require('./mods/giveaways.js')(message, client, prefix, config)

    // AO commands
    require('./ao/sots.js')(message, client, prefix, config)
    require('./ao/jinxs.js')(message, client, prefix, sql)
    require('./ao/events/event-index.js')(message, client, prefix, config, sql)

    // Music commands
    require('./music/_music-index.js')(message, client, prefix)

    // Owner commands
    if (message.author.id == config.discord.owner_id){
        require('./owner/update.js')(message, client, prefix, config)
        require('./owner/eval.js')(message, client, prefix)
        require('./owner/shell.js')(message, client, prefix)
        require('./owner/sql.js')(message, client, prefix, sql)
        require('./owner/gen-api-token.js')(message, client, prefix, sql)
        require('./owner/token-stats.js')(message, client, prefix, sql)
    }

}