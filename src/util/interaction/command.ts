import ExtendedClient from "../../classes/ExtendedClient";
import { ChatInputCommandInteraction } from "discord.js";

import Command from "../../classes/Command";

import Roles, { Role } from "../../classes/Roles";
import { emojis as emoji } from "../../config";
import getRoles from "../../functions/roles/get";
import { noPermissionCommand } from "../embeds";

const cooldowns = new Map();

export = async (client: ExtendedClient, Discord: typeof import("discord.js"), interaction: ChatInputCommandInteraction) => {
    try {
        const command: Command = client.commands.get(interaction.commandName);

        if(!command) return;

        const requiredRoles: Role[] = command.requiredRoles;
        const userRoles: Roles = await getRoles(interaction.user.id, client);

        if(requiredRoles.length && !userRoles.botAdmin) {
            const hasRoles = [];

            for(const role of requiredRoles) {
                if(userRoles[role]) hasRoles.push(role);
            }

            if(requiredRoles.length !== hasRoles.length) return await interaction.reply({ embeds: [noPermissionCommand], ephemeral: true });
        }

        if(!command.enabled) {
            const disabled = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.cross} This command has been disabled!`)

            await interaction.reply({ embeds: [disabled], ephemeral: true });
            return;
        }

        const validPermissions = client.validPermissions;

        if(command.botPermissions.length) {
            const invalidPerms = [];

            for(const perm of command.botPermissions as any) {
                if(!validPermissions.includes(perm)) return;

                if(!interaction.guild.members.me.permissions.has(perm)) invalidPerms.push(perm);
            }

            if(invalidPerms.length) {
                const permError = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`I am missing these permissions: \`${invalidPerms.join("\`, \`")}\``)

                await interaction.reply({ embeds: [permError], ephemeral: true });
                return;
            }
        }

        command.deferReply ? command.ephemeral ? await interaction.deferReply({ ephemeral: true }) : await interaction.deferReply() : null;

        if(userRoles.owner || userRoles.botAdmin) {
            // Log interaction to console
            console.log(`[interactionCreate] [command] ${interaction.user.tag} (${interaction.user.id}): /${interaction.commandName} ${interaction.options.data.map((option: any) => option.value ? `${option.name}:${option.value}` : option.name).join(" ")}`);

            try {
                await command.execute(interaction, client, Discord);
                return;
            } catch(err) {
                client.logError(err);

                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} There was an error while executing that command!`)

                command.deferReply ? await interaction.editReply({ embeds: [error] }) : await interaction.reply({ embeds: [error], ephemeral: true });
                return;
            }
        }

        if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

        const currentTime = Date.now();
        const timeStamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;

        if(timeStamps.has(interaction.user.id)) {
            const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount;

            if(currentTime < expirationTime) {
                const timeLeft: string = (((expirationTime - currentTime) / 1000).toFixed(0)).toString();

                const cooldown = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`⏰ Please wait ${timeLeft} second${timeLeft === "1" ? "" : "s"} before running that command again!`)

                command.deferReply ? await interaction.editReply({ embeds: [cooldown] }) : await interaction.reply({ embeds: [cooldown], ephemeral: true });
                return;
            }
        }

        timeStamps.set(interaction.user.id, currentTime);

        setTimeout(() => {
            timeStamps.delete(interaction.user.id);
        }, cooldownAmount)

        try {
            // Log interaction to console
            console.log(`[interactionCreate] [command] ${interaction.user.tag} (${interaction.user.id}): /${interaction.commandName} ${interaction.options.data.map((option: any) => option.value ? `${option.name}:${option.value}` : option.name).join(" ")}`);

            await command.execute(interaction, client, Discord);
        } catch(err) {
            client.logError(err);

            const error = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.error)
                .setDescription(`${emoji.cross} There was an error while executing that command!`)

            command.deferReply ? await interaction.editReply({ embeds: [error] }) : await interaction.reply({ embeds: [error], ephemeral: true });
        }
    } catch(err) {
        client.logError(err);
    }
}
