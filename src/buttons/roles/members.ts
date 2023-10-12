import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction, Interaction, TextChannel } from "discord.js";

import { emojis as emoji } from "../../config";

const button: Button = {
    name: "role-members",
    startsWith: true,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const id = interaction.customId.replace("role-members-", "");
            const role = interaction.guild.roles.cache.get(id);

            if(!role) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Role not found!`)

                await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }

            const fetching = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Fetching members...`)

            await interaction.reply({ embeds: [fetching], ephemeral: true });

            const members = role.members.sort((a, b) => Number(a.id) - Number(b.id)).map(m => `${m.user.tag.endsWith("#0") ? m.user.username : m.user.tag} (${m.user.id})`);

            if(!members.length) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} No members found!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Convert to TXT file
            const content = members.join("\n");
            const file = new Discord.AttachmentBuilder(Buffer.from(content), { name: `${id}-members.txt` });

            await interaction.editReply({ embeds: [], files: [file] });
        } catch(err) {
            client.logButtonError(err, interaction);
        }
    }
}

export = button;
