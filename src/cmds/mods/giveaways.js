const Discord = require('discord.js')
const DiscordGiveaways = require("discord-giveaways");
const ms = require("ms");
const fs = require('fs')

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = function(message, client, prefix, config){
    if (message.content.toLowerCase().startsWith(prefix + 'giveaway')){
        if (message.member.hasPermission('MANAGE_MESSAGES') || message.member.roles.cache.some(role => role.name.toLowerCase() == 'giveaway host')){
            var args = message.content.split(" ").slice(1);
            if (args.length < 1 || args[0].toLowerCase() == 'help'){
                let embed = new Discord.MessageEmbed
                embed.setTitle(`Set up Giveaways with ${client.user.username}`)
                .addField(prefix + 'giveaway start [channel] [duration] [winners] [name]', `Start a giveaway, will open a menu pannel if no args. Time must be in w(eeks), d(ays), m(inutes), s(econds).\nExample: \`${prefix}giveaway start #giveaways 1d 2 Discord Nitro Classic for one month for two people\``)
                .addField(prefix + 'giveaway reroll [message ID]', `Reroll latest giveaway or specific giveaway with their ID`)
                .addField(prefix + 'giveaway edit [messageID]', `Edits a giveaway, will open a menu pannel`)
                .addField(prefix + 'giveaway delete [messageID]', `Deletes a giveaway, will open a confirmation pannel`)
                .addField(prefix + 'giveaway list', `Lists all giveaways in this server`)
                message.channel.send(embed)
            } else if (args[0].toLowerCase() == 'start') {
                args = args.slice(1)
                if (args.length < 1) {
                    // Menu
                    message.channel.send(`Alright ${message.author.username}, let's start a giveaway! First, mention a channel where the giveaway takes place`)
                    const filter = m => message.author == m.author;
                    const collector = message.channel.createMessageCollector(filter, {time: 60000, max: 1});
                    collector.on('collect', m => {
                        var channel = m.mentions.channels.first()
                        if (!channel) return message.channel.send("This is not a channel, please redo the command to restart the process")
                        message.channel.send('Okay! Now set the duration. It must be in w(eeks), d(ays), m(inutes), s(econds). Example: `2d` for two days, `30m` for 30 minutes etc...')
                        const collector2 = message.channel.createMessageCollector(filter, {time: 60000, max: 1});
                        collector2.on('collect', m => {
                            var time = m.content
                            message.channel.send("Great! Now set the number of winners, how many people can win this prize?")
                            const collector3 = message.channel.createMessageCollector(filter, {time: 60000, max: 1});
                            collector3.on('collect', m => {
                                var winners = parseInt(m.content)
                                message.channel.send("Perfect! Now enter the name of the prize. What will the winners win?")
                                const collector4 = message.channel.createMessageCollector(filter, {time: 60000, max: 1});
                                collector4.on('collect', m => {
                                    var emojiReact = randomItem(JSON.parse(fs.readFileSync('./data/giveaways_reactions.json')))
                                    client.giveawaysManager.start(channel, {
                                        time: ms(time),
                                        prize: m.content,
                                        winnerCount: winners,
                                        hostedBy: message.author,
                                        reaction: emojiReact,
                                        messages: {
                                            giveaway: "<:AOBlobHug2:759800110757576734> **GIVEAWAY** <:AOBlobHug1:759800134908510208>",
                                            giveawayEnded: "~~GIVEAWAY~~",
                                            timeRemaining: "Time remaining: **{duration}**!",
                                            inviteToParticipate: "React with "+emojiReact+" to participate!",
                                            winMessage: "Congratulations, {winners}! You won **{prize}**! <:AOYay:757101895104987178>",
                                            noWinner: "Giveaway cancelled, no valid participations. <:PepeCry:730145204224524410>",
                                            hostedBy: "Hosted by: {user}",
                                            winners: winners == 1 ? "winner" : "winners",
                                            embedFooter: "Good luck to you <:AOheart:732429743101837343>",
                                            endedAt: "Ended at",
                                            units: {
                                                seconds: "seconds",
                                                minutes: "minutes",
                                                hours: "hours",
                                                days: "days",
                                                pluralS: false
                                            }
                                        }
                                    });
                                    message.channel.send(`All done! Your giveaway for **${prize}** has been started at <#${channel.id}>, wish good luck to participants! :wink:`)
                                });
                                collector4.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`Delay expired`)
                                    }
                                });
                            });
                            collector3.on('end', (collected, reason) => {
                                if (reason == 'time'){
                                    message.channel.send(`Delay expired`)
                                }
                            });
                        });
                        collector2.on('end', (collected, reason) => {
                            if (reason == 'time'){
                                message.channel.send(`Delay expired`)
                            }
                        });
                    });
                    collector.on('end', (collected, reason) => {
                        if (reason == 'time'){
                            message.channel.send(`Delay expired`)
                        }
                    });
                } else {
                    // Create instant
                    const channel = message.mentions.channels.first()
                    if (!channel || args.length < 4) return message.channel.send('I don\'t have all arguments!')
                    var emojiReact = randomItem(JSON.parse(fs.readFileSync('./data/giveaways_reactions.json')))
                    client.giveawaysManager.start(channel, {
                        time: ms(args[1]),
                        prize: args.slice(3).join(" "),
                        winnerCount: parseInt(args[2]),
                        hostedBy: message.author,
                        reaction: emojiReact,
                        messages: {
                            giveaway: "<:AOBlobHug2:759800110757576734> **GIVEAWAY** <:AOBlobHug1:759800134908510208>",
                            giveawayEnded: "~~GIVEAWAY~~",
                            timeRemaining: "Time remaining: **{duration}**!",
                            inviteToParticipate: "React with "+emojiReact+" to participate!",
                            winMessage: "Congratulations, {winners}! You won **{prize}**! <:AOYay:757101895104987178>",
                            noWinner: "Giveaway cancelled, no valid participations. <:PepeCry:730145204224524410>",
                            hostedBy: "Hosted by: {user}",
                            winners: parseInt(args[2]) == 1 ? "winner" : "winners",
                            embedFooter: "Good luck to you <:AOheart:732429743101837343>",
                            endedAt: "Ended at",
                            units: {
                                seconds: "seconds",
                                minutes: "minutes",
                                hours: "hours",
                                days: "days",
                                pluralS: false
                            }
                        }
                    });
                    message.channel.send(`All done! Your giveaway for **${args.slice(3).join(" ")}** has been started at <#${channel.id}>, wish good luck to participants! :wink:`)
                }
            } else if (args[0].toLowerCase() == 'reroll'){
                args = args.slice(1)
                if (args.length < 1){
                    var list = client.giveawaysManager.giveaways.filter((g) => g.guildID == message.guild.id && g.channelID == message.channel.id).reverse()
                    client.giveawaysManager.reroll(list.slice(list.length-1)[0].messageID).then(() => {
                        message.channel.send("Success! Giveaway rerolled!");
                    }).catch((err) => {
                        message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', list.slice(list.length-1).messageID));
                    });
                } else {
                    let messageID = args[0];
                    client.giveawaysManager.reroll(messageID).then(() => {
                        message.channel.send("Success! Giveaway rerolled!");
                    }).catch((err) => {
                        message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', messageID));
                    });
                }
            } else if (args[0].toLowerCase() == 'edit'){
                args = args.slice(1)
                var giveaway = client.giveawaysManager.giveaways.filter((g) => g.guildID == message.guild.id && g.messageID == args[0])
                if (giveaway.length < 1) return message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]))
                let embed = new Discord.MessageEmbed
                embed.setTitle('Edit a giveaway')
                .setDescription("Please select what you want to edit:\n1️⃣ Change prize name\n2️⃣ Set number of winners\n3️⃣ Set new end time\n4️⃣ Add/remove time\n❌ Cancel")
                .setColor('#0000FF')
                message.channel.send(embed).then(async (m)=>{
                    var emojis = [
                        '1️⃣', // Change name
                        '2️⃣', // Number of winners
                        '3️⃣', // New end time
                        '4️⃣', // Add or remove time
                        '❌'
                    ]
                    emojis.forEach(async e=>{
                        await m.react(e)
                    })
    
                    const filter = (reaction, user) => {
                        return emojis.includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected=>{
                        const reaction = collected.first();
                        if (reaction.emoji.name === '1️⃣') {
                            embed.setDescription("Type the new prize name of your giveaway")
                            m.edit(embed)
                            const msgFilter = m => message.author == m.author;
                            const collector = message.channel.createMessageCollector(msgFilter, {time: 60000, max: 1});
                            collector.on('collect', m => {
                                client.giveawaysManager.edit(args[0], {
                                    newPrize: m.content,
                                }).then(() => {
                                    message.channel.send("Success! Giveaway will updated in less than ${time} seconds.".replace('${time}', client.giveawaysManager.options.updateCountdownEvery/1000));
                                }).catch((err) => {
                                    message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]));
                                });
                            });
                            collector.on('end', (collected, reason) => {
                                if (reason == 'time'){
                                    message.channel.send(`Delay expired`)
                                }
                            });
                        } else if (reaction.emoji.name === '2️⃣') {
                            embed.setDescription("Type the new number of winners")
                            m.edit(embed)
                            const msgFilter = m => message.author == m.author;
                            const collector = message.channel.createMessageCollector(msgFilter, {time: 60000, max: 1});
                            collector.on('collect', m => {
                                client.giveawaysManager.edit(args[0], {
                                    newWinnerCount: parseInt(m.content),
                                }).then(() => {
                                    message.channel.send("Success! Giveaway will updated in less than ${time} seconds.".replace('${time}', client.giveawaysManager.options.updateCountdownEvery/1000));
                                }).catch((err) => {
                                    message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]));
                                });
                            });
                            collector.on('end', (collected, reason) => {
                                if (reason == 'time'){
                                    message.channel.send(`Delay expired`)
                                }
                            });
                        } else if (reaction.emoji.name === '3️⃣') {
                            embed.setDescription("Type the new duration from now of the giveaway")
                            m.edit(embed)
                            const msgFilter = m => message.author == m.author;
                            const collector = message.channel.createMessageCollector(msgFilter, {time: 60000, max: 1});
                            collector.on('collect', m => {
                                client.giveawaysManager.edit(args[0], {
                                    setEndTimestamp: ms(m.content),
                                }).then(() => {
                                    message.channel.send("Success! Giveaway will updated in less than ${time} seconds.".replace('${time}', client.giveawaysManager.options.updateCountdownEvery/1000));
                                }).catch((err) => {
                                    message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]));
                                });
                            });
                            collector.on('end', (collected, reason) => {
                                if (reason == 'time'){
                                    message.channel.send(`Delay expired`)
                                }
                            });
                        } else if (reaction.emoji.name === '4️⃣') {
                            embed.setDescription("Type the time to add")
                            m.edit(embed)
                            const msgFilter = m => message.author == m.author;
                            const collector = message.channel.createMessageCollector(msgFilter, {time: 60000, max: 1});
                            collector.on('collect', m => {
                                client.giveawaysManager.edit(args[0], {
                                    addTime: ms(m.content),
                                }).then(() => {
                                    message.channel.send("Success! Giveaway will updated in less than ${time} seconds.".replace('${time}', client.giveawaysManager.options.updateCountdownEvery/1000));
                                }).catch((err) => {
                                    message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]));
                                });
                            });
                            collector.on('end', (collected, reason) => {
                                if (reason == 'time'){
                                    message.channel.send(`Delay expired`)
                                }
                            });
                        } else if (reaction.emoji.name === '❌') {
                            embed.setDescription('Canceled')
                            m.edit(embed)
                        }
                    })
                    .catch(()=>{
                        embed.setDescription('Delay expired')
                        m.edit(embed)
                    })
                })
            } else if (args[0].toLowerCase() == 'delete'){
                args = args.slice(1)
                var giveaway = client.giveawaysManager.giveaways.filter((g) => g.guildID == message.guild.id && g.messageID == args[0])
                if (giveaway.length < 1) return message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]))
                message.react('✅').then(() => message.react('❌'));
                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected=>{
                    const reaction = collected.first();
                    if (reaction.emoji.name === '✅') {
                        client.giveawaysManager.delete(args[0]).then(() => {
                            message.channel.send("Success! Giveaway deleted.");
                        }).catch((err) => {
                            message.channel.send("No giveaway found for ${ID}, please check and try again".replace('${ID}', args[0]));
                        });
                    } else {
                        message.delete()
                    }
                })
                .catch(collected => {
                    message.delete();
                });
            } else if (args[0].toLowerCase() == 'list'){
                args = args.slice(1)
                var list = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id)
                var current = []
                var past = []
                list.forEach(g=>{
                    if (!g.ended) current.push(`- \`${g.messageID}\` <#${g.channelID}> - [${g.prize}](https://discord.com/channels/${g.guildID}/${g.channelID}/${g.messageID}) - Ends in ${ms((g.endAt - Date.now()),{long:true})}`)
                    else past.push(`- [${g.prize}](https://discord.com/channels/${g.guildID}/${g.channelID}/${g.messageID})`)
                })
                if (current.length < 1) current.push("No active giveaways :(")
                if (past.length < 1) past.push("No past giveaways.")
                let embed = new Discord.MessageEmbed
                embed.setTitle("Active giveaways")
                .setDescription(current.reverse().join('\n'))
                .addField("Last 10 giveaways", past.slice(past.length - 10, past.length).reverse().join('\n'))
                .setColor('RANDOM')
                message.channel.send(embed)
            }
        }
        else message.channel.send("You don't have sufficient permissions to make/manage a giveaway. You must be at least a moderator or you must have the role \"Giveaway Host\"")
    }
}
