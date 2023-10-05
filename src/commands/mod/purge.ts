import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "purge",
    description: "Purge messages in a channel.",
    options: [
        {
            type: 4,
            name: "amount",
            description: "The amount of messages to purge.",
            min_value: 2,
            max_value: 100,
            required: true
        }
    ],
    default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
    botPermissions: [],
    requiredRoles: [],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const amount = interaction.options.get("amount").value as number;

            const fetching = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Fetching messages...`)

            await interaction.editReply({ embeds: [fetching] });

            const messages = await interaction.channel.messages.fetch({ limit: amount });

            if(messages.size === 0) {
                const noMessages = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.cross} No messages found.`)

                await interaction.editReply({ embeds: [noMessages] });
                return;
            }

            const found = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Purging ${messages.size} messages...`)

            await interaction.editReply({ embeds: [found] });

            // Delete the messages
            const result = await interaction.channel.bulkDelete(messages, true);

            if(result.size === 0) {
                const noDeleted = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.default)
                    .setDescription(`${emoji.cross} No messages were deleted.`)

                await interaction.editReply({ embeds: [noDeleted] });
                return;
            }

            const deleted = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Deleted ${result.size} messages.`)

            await interaction.editReply({ embeds: [deleted] });

            // Generate output
            const output = [];

            for(const message of result.values()) {
                if(!message.content) continue;

                output.push(`[${message.id}] ${message.author.tag.endsWith("#0") ? message.author.username : message.author.tag} (${message.author.id}): ${message.content}`);
            }

            // Sort output by message ID (oldest to newest)
            output.sort((a, b) => {
                const idA = a.split(" ")[0].replace("[", "").replace("]", "");
                const idB = b.split(" ")[0].replace("[", "").replace("]", "");

                return parseInt(idA) - parseInt(idB);
            })

            // Generate result file
            const file = Buffer.from(`${new Date().toUTCString()}\n\n${output.join("\n")}`);
            const attachment = new Discord.AttachmentBuilder(file, { name: "result.txt" });

            const log = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setAuthor({ name: interaction.user.tag.endsWith("#0") ? interaction.user.username : interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                .setTitle("Purge")
                .addFields (
                    { name: "Channel", value: `${interaction.channel}`, inline: true },
                    { name: "Messages", value: `${result.size}`, inline: true }
                )
                .setTimestamp()

            const channel = client.channels.cache.get(client.config_channels.modLogs) as TextChannel;

            channel.send({ embeds: [log], files: output.length ? [attachment] : [] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
