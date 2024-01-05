import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";

const button: Button = {
    name: "ticket-close",
    startsWith: true,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.customId.replace("ticket-close-", "");

            const userRoles = await getRoles(interaction.user.id, client);

            if(user !== interaction.user.id && !userRoles.staff) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot close another user's ticket!`)

                await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }

            // Confirmation
            const confirmation = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription("Are you sure you want to close this ticket?")

            const row: any = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setCustomId(`confirm-${interaction.id}`)
                        .setEmoji(emoji.dbh_check),
                        
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setCustomId(`cancel-${interaction.id}`)
                        .setEmoji(emoji.dbh_cross)
                )

            const confirmMsg = await interaction.reply({ embeds: [confirmation], components: [row], ephemeral: true });

            const filter = (i: any) => i.user.id === interaction.user.id && i.customId.startsWith("confirm-") || i.customId.startsWith("cancel-");

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

            collector.on("collect", async i => {
                if(i.customId === `confirm-${interaction.id}`) {
                    collector.stop();

                    const closing = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.ping} Closing ticket...`)

                    await confirmMsg.edit({ embeds: [closing], components: [] });

                    const ticketAuthor = await client.users.fetch(user);

                    // Export transcript
                    const messages = (await interaction.channel.messages.fetch({ limit: 100 })).reverse();

                    let transcript = "";

                    messages.forEach(m => {
                        const createdAt = m.createdAt.toUTCString();
                        const author = m.author.tag;
                        const id = m.author.id;
                        const embeds = m.embeds.length;
                        const attachments = m.attachments.size;
                        const content = m.content || "";

                        transcript += `[${createdAt}] ${author} (${id}) [${embeds} embed${embeds === 1 ? "" : "s"}, ${attachments} attachment${attachments === 1 ? "" : "s"}]: ${content}\n`;
                    })

                    const closedTicket = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ extension: "png", forceStatic: false }), url: `https://discord.com/users/${interaction.user.id}` })
                        .setTitle("Ticket Closed")
                        .addFields (
                            { name: "Author", value: `${ticketAuthor} **|** \`${ticketAuthor.id}\``, inline: true },
                            { name: "Opened", value: `<t:${interaction.channel.createdTimestamp.toString().slice(0, -3)}:f> (<t:${interaction.channel.createdTimestamp.toString().slice(0, -3)}:R>)`, inline: true }
                        )
                        .setTimestamp()

                    const transcriptChannel = await client.channels.fetch(client.config_channels.ticketLogs) as TextChannel;
                    const transcriptFile = new Discord.AttachmentBuilder(Buffer.from(transcript), { name: `transcript-${Date.now()}.txt` });

                    await transcriptChannel.send({ embeds: [closedTicket], files: transcript.length ? [transcriptFile] : [] });

                    await interaction.channel.delete();
                }
                
                if(i.customId === `cancel-${interaction.id}`) {
                    collector.stop();

                    const cancelled = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Operation cancelled!`)

                    await confirmMsg.edit({ embeds: [cancelled], components: [] });
                    return;
                }
            })

            collector.on("end", async collected => {
                let validInteractions = [];

                collected.forEach(c => {
                    if(c.user.id === interaction.user.id) validInteractions.push(c);
                })

                if(validInteractions.length == 0) {
                    const cancelled = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Operation cancelled.`)

                    await interaction.editReply({ embeds: [cancelled], components: [] });
                }
            })
        } catch(err) {
            client.logButtonError(err, interaction);
        }
    }
}

export = button;
