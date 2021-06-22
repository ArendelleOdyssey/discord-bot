// Announcement command for odys' bot
// Will only work inside of AO but you can change the script.
// Dhillon#2020, might want to change a couple of things, lmk if you want me to change em.

const discord = require('discord.js')

module.exports = function(message, client, prefix, config){
    if (message.content.toLowerCase() == prefix + "announce") {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            let embed = new discord.MessageEmbed()
                .setTitle("Embed")
                .setDescription("Please specify a __channel__ to send this announcement in\n\nSay `cancel` to cancel")
                .setColor("DEFAULT");
            message.channel.send(embed).then((m) => {
                m.channel.awaitMessages((response) => response.author.id === message.author.id && (response.content == "cancel" || response.mentions.channels.first()), { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                    if (collected.first().mentions.channels.first()) {
                        var channel = collected.first().mentions.channels.first();
                        let embed = new discord.MessageEmbed()
                            .setTitle("Embed")
                            .setDescription("Please specify a __title__ for this announcement\n\nSay `cancel` to cancel or `skip` to skip this prompt")
                            .setColor("DEFAULT");
                        m.edit(embed).then((m) => {
                            if (collected.first().deletable) {
                                collected.first().delete();
                            }
                            m.channel.awaitMessages((response) => response.author.id === message.author.id, { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                                if (collected.first().content != "cancel") {
                                    var title = collected.first().content == "skip" ? null : collected.first().content;
                                    let embed = new discord.MessageEmbed()
                                        .setTitle("Embed")
                                        .setDescription("Please specify a __description__ for this announcement\n\nSay `cancel` to cancel or `skip` to skip this prompt")
                                        .setColor("DEFAULT");
                                    m.edit(embed).then((m) => {
                                        if (collected.first().deletable) {
                                            collected.first().delete();
                                        }
                                        m.channel.awaitMessages((response) => response.author.id === message.author.id, { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                                            if (collected.first().content != "cancel") {
                                                var description = collected.first().content == "skip" ? null : collected.first().content;
                                                let embed = new discord.MessageEmbed()
                                                    .setTitle("Embed")
                                                    .setDescription("Please specify a __thumbnail__ for this announcement\n\nSay `cancel` to cancel or `skip` to skip this prompt")
                                                    .setColor("DEFAULT");
                                                m.edit(embed).then((m) => {
                                                    if (collected.first().deletable) {
                                                        collected.first().delete();
                                                    }
                                                    m.channel.awaitMessages((response) => response.author.id === message.author.id, { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                                                        if (collected.first().content != "cancel") {
                                                            var thumbnail = collected.first().content == "skip" ? null : (collected.first().attachments.first() ? collected.first().attachments.first().url : collected.first().content);
                                                            if (collected.first().deletable && collected.first().attachments.first()) {
                                                                collected.first().delete();
                                                            }
                                                            let embed = new discord.MessageEmbed()
                                                                .setTitle("Embed")
                                                                .setDescription("Please specify an __image__ for this announcement\n\nSay `cancel` to cancel or `skip` to skip this prompt")
                                                                .setColor("DEFAULT");
                                                            m.edit(embed).then((m) => {
                                                                m.channel.awaitMessages((response) => response.author.id === message.author.id, { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                                                                    if (collected.first().content != "cancel") {
                                                                        var image = collected.first().content == "skip" ? null : (collected.first().attachments.first() ? collected.first().attachments.first().url : collected.first().content);
                                                                        if (collected.first().deletable && collected.first().attachments.first()) {
                                                                            collected.first().delete();
                                                                        }
                                                                        let embed = new discord.MessageEmbed()
                                                                            .setTitle("Embed")
                                                                            .setDescription("Please specify a __footer image__ for this announcement\n\nSay `cancel` to cancel or `skip` to skip this prompt")
                                                                            .setColor("DEFAULT");
                                                                        m.edit(embed).then((m) => {
                                                                            m.channel.awaitMessages((response) => response.author.id === message.author.id, { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                                                                                if (collected.first().content != "cancel") {
                                                                                    var footer_image = collected.first().content == "skip" ? null : (collected.first().attachments.first() ? collected.first().attachments.first().url : collected.first().content);
                                                                                    if (collected.first().deletable && collected.first().attachments.first()) {
                                                                                        collected.first().delete();
                                                                                    }
                                                                                    let embed = new discord.MessageEmbed()
                                                                                        .setTitle("Embed")
                                                                                        .setDescription("Please specify __footer text__ for this announcement\n\nSay `cancel` to cancel or `skip` to skip this prompt\n\nThis is the **final** prompt")
                                                                                        .setColor("DEFAULT");
                                                                                    m.edit(embed).then((m) => {
                                                                                        m.channel.awaitMessages((response) => response.author.id === message.author.id, { max: 1, time: 120000, errors: ["time"] }).then((collected) => {
                                                                                            if (collected.first().content != "cancel") {
                                                                                                let footer_text = collected.first().content == "skip" ? null : collected.first().content;
                                                                                                if (collected.first().deletable) {
                                                                                                    collected.first().delete();
                                                                                                }
                                                                                                // CREATE EMBED
                                                                                                let embed = new discord.MessageEmbed().setColor("DEFAULT");
    
                                                                                                if (title !== null) {
                                                                                                    embed = embed.setTitle(title);
                                                                                                }
                                                                                                if (description != null) {
                                                                                                    embed = embed.setDescription(description);
                                                                                                }
                                                                                                if (thumbnail != null) {
                                                                                                    embed = embed.setThumbnail(thumbnail);
                                                                                                }
                                                                                                if (image != null) {
                                                                                                    embed = embed.setImage(image);
                                                                                                }
                                                                                                if (footer_text != null) {
                                                                                                    embed = embed.setFooter(footer_text, footer_image);
                                                                                                }
    
                                                                                                // SEND
                                                                                                if (embed != null) {
                                                                                                    channel.send(embed).then(() => {
                                                                                                        let embed = new discord.MessageEmbed()
                                                                                                            .setTitle("Success")
                                                                                                            .setDescription("Sent")
                                                                                                            .setColor("DEFAULT");
                                                                                                        m.edit(embed);
                                                                                                    }).catch(() => {
                                                                                                        let embed = new discord.MessageEmbed()
                                                                                                            .setTitle("Error")
                                                                                                            .setDescription("Unable to send embed")
                                                                                                            .setColor("DEFAULT");
                                                                                                        m.edit(embed);
                                                                                                    });
                                                                                                } else {
                                                                                                    let embed = new discord.MessageEmbed()
                                                                                                        .setTitle("Error")
                                                                                                        .setDescription("No content to send")
                                                                                                        .setColor("DEFAULT");
                                                                                                    m.edit(embed);
                                                                                                }
                                                                                            } else {
                                                                                                let embed = new discord.MessageEmbed()
                                                                                                    .setTitle("Cancelled")
                                                                                                    .setDescription("Prompt timeout")
                                                                                                    .setColor("DEFAULT");
                                                                                                m.channel.send(embed);
                                                                                            }
                                                                                        }).catch(() => {
                                                                                            let embed = new discord.MessageEmbed()
                                                                                                .setTitle("Cancelled")
                                                                                                .setDescription("Prompt timeout")
                                                                                                .setColor("DEFAULT");
                                                                                            m.channel.send(embed);
                                                                                        });
                                                                                    });
                                                                                } else {
                                                                                    let embed = new discord.MessageEmbed()
                                                                                        .setTitle("Cancelled")
                                                                                        .setDescription("Prompt cancelled")
                                                                                        .setColor("DEFAULT");
                                                                                    m.channel.send(embed);
                                                                                }
                                                                            }).catch(() => {
                                                                                let embed = new discord.MessageEmbed()
                                                                                    .setTitle("Cancelled")
                                                                                    .setDescription("Prompt timeout")
                                                                                    .setColor("DEFAULT");
                                                                                m.channel.send(embed);
                                                                            });
                                                                        });
                                                                    } else {
                                                                        let embed = new discord.MessageEmbed()
                                                                            .setTitle("Cancelled")
                                                                            .setDescription("Prompt cancelled")
                                                                            .setColor("DEFAULT");
                                                                        m.channel.send(embed);
                                                                    }
                                                                }).catch(() => {
                                                                    let embed = new discord.MessageEmbed()
                                                                        .setTitle("Cancelled")
                                                                        .setDescription("Prompt timeout")
                                                                        .setColor("DEFAULT");
                                                                    m.channel.send(embed);
                                                                });
                                                            });
                                                        } else {
                                                            let embed = new discord.MessageEmbed()
                                                                .setTitle("Cancelled")
                                                                .setDescription("Prompt cancelled")
                                                                .setColor("DEFAULT");
                                                            m.channel.send(embed);
                                                        }
                                                    }).catch(() => {
                                                        let embed = new discord.MessageEmbed()
                                                            .setTitle("Cancelled")
                                                            .setDescription("Prompt timeout")
                                                            .setColor("DEFAULT");
                                                        m.channel.send(embed);
                                                    });
                                                });
                                            } else {
                                                let embed = new discord.MessageEmbed()
                                                    .setTitle("Cancelled")
                                                    .setDescription("Prompt cancelled")
                                                    .setColor("DEFAULT");
                                                m.channel.send(embed);
                                            }
                                        }).catch(() => {
                                            let embed = new discord.MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("Prompt timeout")
                                                .setColor("DEFAULT");
                                            m.channel.send(embed);
                                        });
                                    });
                                } else {
                                    let embed = new discord.MessageEmbed()
                                        .setTitle("Cancelled")
                                        .setDescription("Prompt cancelled")
                                        .setColor("DEFAULT");
                                    m.channel.send(embed);
                                }
                            }).catch(() => {
                                let embed = new discord.MessageEmbed()
                                    .setTitle("Cancelled")
                                    .setDescription("Prompt timeout")
                                    .setColor("DEFAULT");
                                m.channel.send(embed);
                            });
                        });
                    } else {
                        let embed = new discord.MessageEmbed()
                            .setTitle("Cancelled")
                            .setDescription("Prompt cancelled")
                            .setColor("DEFAULT");
                        m.channel.send(embed);
                    }
                }).catch(() => {
                    let embed = new discord.MessageEmbed()
                        .setTitle("Cancelled")
                        .setDescription("Prompt timeout")
                        .setColor("DEFAULT");
                    m.channel.send(embed);
                });
            });
        } else {
            let embed = new discord.MessageEmbed()
                .setTitle("Error")
                .setColor("DEFAULT")
                .setDescription("You do not have permission to do this")
            message.channel.send(embed);
        }
    }
}