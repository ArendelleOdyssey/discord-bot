const Discord = require('discord.js')

module.exports = function(client, message, prefix, config, sql){

    require('./help.js')(client, message, prefix, config)
    require('./user-cmds/bot-mention.js')(client, message, prefix, config, sql)
    require('./user-cmds/custom-user-commands.js')(client, message, prefix, config, sql)
    require('./user-cmds/custom-commands-list.js')(client, message, prefix, config, sql)

    // Twitter integration
    require('./twitter/tweet.js')(client, message, prefix, config)
    require('./twitter/last-tweet.js')(client, message, prefix, config)

    // AO managment commands
    require('./mods/stats/_stats-index.js')(message, client, prefix, config, sql)
    //require('./mods/embed-announcement.js')(message, client, prefix, config)
    require('./mods/giveaways.js')(message, client, prefix, config)

    // AO commands
    require('./ao/sots.js')(message, client, prefix, config)
    require('./ao/events/event-index.js')(message, client, prefix, config, sql)

    // Owner commands
    if (message.author.id == config.discord.owner_id){
        require('./owner/update.js')(message, client, prefix, config)
        require('./owner/eval.js')(message, client, prefix)
        require('./owner/shell.js')(message, client, prefix)
        require('./owner/sql.js')(message, client, prefix, sql)
    }

}