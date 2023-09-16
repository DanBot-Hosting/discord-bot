import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChannelType, Message, PermissionResolvable } from "discord.js";

import cap from "../../util/cap";
import { emojis as emoji, main } from "../../config";

const event: Event = {
    name: "messageCreate",
    once: false,
    async execute(client: ExtendedClient & any, Discord: any, message: Message) {
        try {
            // Required permissions for the bot to function
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // If the message is from a bot, ignore the message
            if(message.author.bot) return;

            // Send message to channel through the bot's DMs
            if(message.channel.type === ChannelType.DM && main.dmAllowed.includes(message.author.id)) {
                const args = message.content.trim().split(/ +/g);

                if(!args[1]) return message.reply("Please provide the text you would like to send to the channel.");

                try {
                    const msg = await client.channels.cache.get(args[0]).send(cap(message.content.split(" ").slice(1).join(" "), 2000));

                    // Message successfully sent
                    message.reply(msg.url);
                } catch(err) {
                    // Message failed to send
                    message.reply(`\`\`\`${err.message}\`\`\``);
                }

                return;
            }

            // If the message wasn't sent in a guild, ignore the message
            if(!message.guild) return;
            // If the bot doesn't have the required permissions, ignore the message
            if(!message.guild.members.me.permissions.has(requiredPerms)) return;

            // Eval command
            if(message.content.startsWith(`${main.legacyPrefix.toLowerCase()}eval`) && main.evalAllowed.includes(message.author.id)) {
                const args = message.content.split(" ").slice(1).join(" ");

                if(!args[0]) return message.reply("Please provide the code you would like to run.");

                try {
                    // Run the code
                    const output = await eval(args);

                    if(output) {
                        // Output was returned
                        // Censor the database URL, Sentry DSN and bot token
                        message.reply(`\`\`\`${output.toString().replace(process.env.database, "CENSORED_DATABSE").replace(process.env.sentry_dsn, "CENSORED_SENTRY_DSN").replace(process.env.token, "CENSORED_TOKEN")}\`\`\``);
                    } else {
                        // No output was returned
                        const noOutput = new Discord.EmbedBuilder()
                            .setColor(client.config_embeds.error)
                            .setDescription(`${emoji.cross} No output was returned.`)

                        message.reply({ embeds: [noOutput] });
                    }
                } catch(err) {
                    message.reply(`\`\`\`${err.message}\`\`\``);
                }

                return;
            }

            // Prefix command deprecation
            if(message.content.toLowerCase().startsWith(main.legacyPrefix.toLowerCase()) && message.content.length > main.legacyPrefix.length + 3) {
                const description = [
                    `👋 Hey there ${message.author}!`,
                    `\nIn the recent rewrite of the DBH Discord bot we have decided to move away from prefix commands (e.g. \`${main.legacyPrefix}help\`) and have moved to slash commands (e.g. \`/help\`).`,
                    "\nThis change has been made to help make development easier of the Discord bot and allow us to maintain it easily.",
                    "\nRegards,",
                    "The **DanBot Team**"
                ]

                const legacy = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setTitle("Deprecation of Prefix Commands")
                    .setDescription(description.join("\n"))

                message.reply({ embeds: [legacy] });
                return;
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
