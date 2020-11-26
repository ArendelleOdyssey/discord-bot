const Discord = require('discord.js')

module.exports = function(client, message, prefix, config, sql){

    require('./help.js')(client, message, prefix, config)
    require('./bot-mention.js')(client, message, prefix, config)

    // Twitter integration
    require('./twitter/tweet.js')(client, message, prefix, config)

    // AO commands
    require('./ao/sots.js')(message, client, prefix, config)
    require('./ao/events/event-index.js')(message, client, prefix, config, sql)

    // Owner commands
    if (message.author.id == config.discord.owner_id){
        require('./owner/update.js')(message, client, prefix, config)
    }

}