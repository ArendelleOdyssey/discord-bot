const shell = require('shelljs')

module.exports = function(client, config){
    setInterval(function(){
        console.log('Checking for updates...')
        shell.exec('git status', {silent: true}, function(code, stdout, stderr) {
            if (stdout.includes('Your branch is up to date') && code == 0) return console.log(stdout)
            else {
                console.log('Updates available, installing...')
                shell.exec('git pull', {silent: true}, function(code, stdout, stderr) {
                    if (stdout.includes('Already up to date.') && code == 0) return console.log(stdout)
                    else {
                        if (code != 0) {
                            console.error(stderr)
                            client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on auto-updater: \`\`\`${stderr}\`\`\``)
                            return
                        }
                        console.log('Updates installed, reloading the server...')
                        shell.exec(`pm2 reload ${client.user.id == config.discord.bot_id_beta ? 'beta.':''}ecosystem.config.js`, function(code, stdout, stderr) {
                            if (code != 0) {
                                console.error(stderr)
                                client.users.cache.find(u => u.id == config.discord.owner_id).send(`:warning: Error on auto-updater: \`\`\`${stderr}\`\`\``)
                                return
                            }
                            console.log('Bye old version :)')
                        })
                    }
                })
            }
        })
    }, 24*60*60*1*1000)
}