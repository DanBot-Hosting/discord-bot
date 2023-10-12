import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { Attachment, AutocompleteInteraction, CommandInteraction, PermissionFlagsBits, Role } from "discord.js";

import { emojis as emoji } from "../../config";

const command: Command = {
    name: "update-role-icon",
    description: "Update a role's icon.",
    options: [
        {
            type: 3,
            name: "role",
            description: "The role to be updated.",
            required: true,
            autocomplete: true
        },

        {
            type: 11,
            name: "icon",
            description: "The new icon to be set.",
            required: true
        }
    ],
    default_member_permissions: PermissionFlagsBits.ManageRoles.toString(),
    botPermissions: ["ManageRoles"],
    requiredRoles: ["admin"],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const roleId = interaction.options.get("role").value as string;
            const icon: Attachment = interaction.options.get("icon").attachment;

            if(!interaction.guild.roles.cache.has(roleId)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} That role doesn't exist.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const role = interaction.guild.roles.cache.get(roleId);

            const member = interaction.guild.members.cache.get(interaction.user.id);

            if(member.roles.highest.position < role.position) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You cannot update that role!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const setting = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Updating the icon of ${role}...`)

            await interaction.editReply({ embeds: [setting] });

            try {
                await role.setIcon(icon.url ?? icon.proxyURL);
            } catch(err) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} There was an error updating the role icon.\n\`\`\`${err}\`\`\``)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const updated = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setThumbnail(role.iconURL({ extension: "png", forceStatic: false }))
                .setDescription(`${emoji.tick} Updated the role icon for ${role}!`)

            await interaction.editReply({ embeds: [updated] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    },
    async autocomplete(interaction: AutocompleteInteraction, client: ExtendedClient) {
        const option = interaction.options.getFocused(true);

        if(option.name === "role") {
            let choices = interaction.guild.roles.cache.map((role: Role) => {
                return {
                    name: role.name,
                    value: role.id
                }
            })

            choices = choices.filter((choice: any) => choice.name.toLowerCase().includes(option.value.toLowerCase()));

            if(choices.length > 25) choices.length = 25;

            await interaction.respond(choices);
        }
    }
}

export = command;
