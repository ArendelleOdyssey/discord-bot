const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./data/config.json'))
const Discord = require('discord.js')
const client = new Discord.Client()
const wait = require('util').promisify(setTimeout);

const MySQL = require('mysql')
const sql = MySQL.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
})
sql.connect((err)=>{
    if (err){
        console.error('Impossible to connect to MySQL server. Code: ' + err.code)
        process.exit(99)
    } else {
        console.log('[SQL] Connected to the MySQL server! Connexion ID: ' + sql.threadId)
    }
})
sql.query('SHOW TABLES', async function (error, results, fields) {
    if (error) throw error;
    if (results.length == 0){
        console.log('[SQL] No tables are set in the database')
        await require('./sqlScripts/create-tables.js')(sql, client)
    }
});
const Twitter = require('twitter-lite')

const DiscordGiveaways = require("discord-giveaways");
const GiveawayManager = class extends DiscordGiveaways.GiveawaysManager {
    async getAllGiveaways(){
        return new Promise(function (resolve, reject) {
            sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err);
                }
                const giveaways = res.map((row) => JSON.parse(row.data));
                resolve(giveaways);
            })
        });
    }
    async saveGiveaway(messageID, giveawayData){
        return new Promise(function (resolve, reject) {
            sql.query("INSERT INTO `giveaways` (`message_id`, `data`) VALUES (?,?)", [messageID, JSON.stringify(giveawayData, null, 2)], (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err);
                }
                resolve(true);
            })
        })
    }
    async editGiveaway(messageID, giveawayData){
        return new Promise(function (resolve, reject) {
            sql.query('UPDATE `giveaways` SET `data` = ? WHERE `message_id` = ?', [JSON.stringify(giveawayData, null, 2), messageID], (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err);
                }
                resolve(true);
            })
        })
    }
    async deleteGiveaway(messageID){
        return new Promise(function (resolve, reject) {
            sql.query('DELETE FROM `giveaways` WHERE `message_id` = ?', messageID, (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err);
                }
                resolve(true);
            })
        })
    }
};
const giveawaysManager = new GiveawayManager(client, {
    storage: false,
    updateCountdownEvery: 20 * 1000,
    default: {
        botsCanWin: false,
        embedColor: "#000F42",
        reaction: "<a:RainbowHype:747087403554045962>"
    }
});
client.giveawaysManager = giveawaysManager;

var guild
const execArgs = process.argv;
if (execArgs.includes('-d')) {
    console.log('Started as Dev bot')
    client.login(config.discord.token_beta)
    guild = "662011227639250972"
}
else {
    console.log('Started as normal')
    client.login(config.discord.token)
    guild = "729083124226719816"
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

client.on('ready', async () => {
    try{
        await wait(1000);

        console.log(`Logged in as ${client.user.tag}`)

        // Auto-updater every day
        require('./events/auto-updater.js')(client, config)
    
        // Create REST API for api.arendelleodyssey.com
        require('./api/_express.js')(client, config, sql, guild)
          
        if (client.user.id == config.discord.bot_id){

            new Promise((resolve, reject)=>{
                client.user.setActivity('Welcome To Arendelle Odyssey!')
                setInterval(()=>{
                    var actmsg
                    var actmsgs = [
                        'Welcome To Arendelle Odyssey!',
                        config.discord.prefix + 'help',
                        'jinxs',
                        'on Twitter @ArendelleO',
                        'on Instagram @arendelleodyssey',
                        'on Reddit r/ArendelleOdyssey',
                        'arendelleodyssey.com',
                        'user',
                        'music'
                    ];
                    var status = randomItem(actmsgs)
                    if (status == 'user'){
                        var user = randomItem(client.guilds.cache.get(guild).members.cache.array())
                        var nick = user.nickname
                        if (nick == null) actmsg = user.user.username
                        else actmsg = nick
                    }
                    else if (status == 'jinxs'){
                        sql.query("SELECT * FROM `jinxs`", function (err, res) {
                            if (err) {
                                console.error(err)
                                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error getting jinx counter: \`\`\`${err}\`\`\``)
                                actmsg = randomItem(actmsgs)
                            } else {
                                actmsg = res[0].count + ' jinxs!'
                            }
                        })
                    }
                    else if (status == 'music'){
                        sql.query("SELECT * FROM `music` WHERE `isPlaying` = 1", function (err, res) {
                            if (err) {
                                console.error(err)
                                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error getting jinx counter: \`\`\`${err}\`\`\``)
                                actmsg = randomItem(actmsgs)
                            } else {
                                if (res.length < 1) actmsg = config.discord.prefix + "music"
                                else actmsg = "🎶 " + res[0].name
                            }
                        })
                    }
                    else actmsg = status
                    
                    client.user.setActivity(actmsg)
                }, 3 * 60 * 1000);
            })
            
            const twitter_client = new Twitter({
                consumer_key:        config.twitter.consumer_key,
                consumer_secret:     config.twitter.consumer_secret,
                access_token_key:    config.twitter.access_token_key,
                access_token_secret: config.twitter.access_token_secret,
            });
    
            client.user.setActivity(config.discord.prefix + 'help', { type: 'WATCHING' })
            client.user.setStatus('online')
            
            // Read @ArendelleO Tweets
            require('./events/streaming-tweets.js')(twitter_client, client, config, sql)
    
            // Read @arendelleodyssey IG posts
            //var old_ig_id = undefined
            //require('./events/streaming-ig.js')(client, config, old_ig_id)
    
            // Check new youtube posts
            require('./events/streaming-yt.js')(client, config)
    
            // Read r/arendelleodyssey posts
            require('./events/streaming-reddit.js')(client, config)
    
            // timer messages in general channel
            require('./events/auto-messages-info.js')(client)
    
        } else if (client.user.id == config.discord.bot_id_beta) {
            client.user.setActivity(config.discord.prefix_beta + 'help', { type: 'LISTENING' })
            client.user.setStatus('idle')
        }
    } catch (err) {
        console.error(err)
        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on ready event: \`\`\`${err}\`\`\``)
    }
})

client.on('message', message => {
    try{
        if (message.author.bot) return
        if (message.channel.type != 'text') return
        // Set bot's prefix (if bot is prod bot or dev bot)
        var prefix
        if (client.user.id == config.discord.bot_id){
            prefix = config.discord.prefix
        } else if (client.user.id == config.discord.bot_id_beta) {
            prefix = config.discord.prefix_beta
            client.user.setActivity(config.discord.prefix_beta + 'help', { type: 'LISTENING' })
        }

        // Check his roles to remove them
        require('./events/check-roles.js')(client, message, guild, config)

        // Jinx!
        require('./events/jinx.js')(client, message, sql)

        // Auto publisher messages (API from https://github.com/Forcellrus/Discord-Auto-Publisher but simplified for one server)
        require('./events/auto-publish.js')(client, message, config)
        
        require('./cmds/import_cmds.js')(client, message, prefix, config, sql)
    } catch (err) {
        console.error(err)
        message.channel.send('Hmm... There\'s an unattended error while running this command. This is reported')
        client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on message event: \`\`\`${err}\`\`\``)
    }
})
