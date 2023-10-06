import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";
import formatCurrency from "../../util/formatCurrency";

const command: Command = {
    name: "drop-code",
    description: "Create a code drop which will give credits to whoever claims it.",
    options: [
        {
            type: 7,
            name: "channel",
            description: "The channel to send the code to.",
            channel_types: [0],
            required: true
        },

        {
            type: 4,
            name: "time",
            description: "The amount of time (in seconds) until the code is sent.",
            required: true
        },

        {
            type: 4,
            name: "credits",
            description: "The amount of credits the code will give.",
            min_value: 1,
            max_value: 10,
            required: true
        },

        {
            type: 3,
            name: "code",
            description: "The name of the code which will be redeemed.",
            min_length: 5,
            max_length: 32,
            required: false
        }
    ],
    default_member_permissions: null,
    botPermissions: ["ManageRoles"],
    requiredRoles: ["admin"],
    cooldown: 60,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const channel = interaction.options.get("channel").channel as TextChannel;
            const time = interaction.options.get("time").value as number;
            const credits = interaction.options.get("credits").value as number;
            const code = interaction.options.get("code")?.value as string;

            // Generate a 16 character code
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            let generatedCode = "";

            const promises = [];

            if(!code) {
                for(let i = 0; i < 16; i++) {
                    promises.push(new Promise((resolve) => {
                        generatedCode += characters.charAt(Math.floor(Math.random() * characters.length));
                        resolve(generatedCode);
                    }))
                }
            } else {
                generatedCode = code;
            }

            await Promise.all(promises);

            // Create the code drop embed
            const drop = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                .setTitle("Code Drop")
                .setDescription(`Use </redeem:${client.commandIds.get("redeem")}> to claim the code!\nThis code will expire in 2 minutes.`)
                .addFields (
                    { name: "Code", value: `||${generatedCode}||`, inline: true },
                    { name: "Credits", value: `**${formatCurrency(credits)}**`, inline: true }
                )

            // Set timeout to send the code
            setTimeout(async () => {
                drop.setTimestamp();

                const msg = await channel.send({ embeds: [drop] });

                client.drops.set(generatedCode, {
                    channel: channel.id,
                    message: msg.id,
                    credits: credits,
                    claimed: false
                })

                setTimeout(() => {
                    if(!client.drops.get(generatedCode)) {
                        client.drops.delete(generatedCode);
                        return;
                    } else {
                        client.drops.delete(generatedCode);
                    }

                    const expired = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} This code has expired!`)

                    msg.edit({ embeds: [...msg.embeds, expired] });
                }, 120 * 1000);
            }, time * 1000);

            // Send confirmation message
            const set = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} \`${generatedCode}\` will be dropped in ${channel} <t:${Math.floor(Date.now() / 1000) + time}:R>!`)

            await interaction.editReply({ embeds: [set] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
