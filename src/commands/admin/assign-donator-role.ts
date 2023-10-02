import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

import User from "../../models/User";

const command: Command = {
    name: "assign-donator-role",
    description: "Ensure all donators have the donator role.",
    options: [],
    default_member_permissions: null,
    botPermissions: ["ManageRoles"],
    requiredRoles: ["admin"],
    cooldown: 10,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const fetching = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Fetching users...`)

            const i = await interaction.editReply({ embeds: [fetching] });

            const roleChanges = [];

            const data = await User.find({ credit_amount: { $gt: 0 } });
            const zeroData = await User.find({ credit_amount: 0 });

            const assigning = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.ping} Assigning roles...`)

            await i.edit({ embeds: [assigning] });

            for(const user of data) {
                const member = await interaction.guild.members.fetch(user._id).catch(() => null);

                if(!member) continue;

                if(!member.roles.cache.has(client.config_roles.donator)) {
                    await member.roles.add(client.config_roles.donator);
                    roleChanges.push(`+ ${member.user.username} (${member.user.id})`);
                }
            }

            for(const user of zeroData) {
                const member = await interaction.guild.members.fetch(user._id).catch(() => null);

                if(!member) continue;

                if(member.roles.cache.has(client.config_roles.donator)) {
                    await member.roles.remove(client.config_roles.donator);
                    roleChanges.push(`- ${member.user.username} (${member.user.id})`);
                }
            }

            if(!roleChanges.length) {
                const result = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} No role changes were made.`)

                await i.edit({ embeds: [result] });
                return;
            }

            const additions = roleChanges.filter(r => r.startsWith("+"));
            const removals = roleChanges.filter(r => r.startsWith("-"));

            const fileContent = `Role: ${client.config_roles.donator}\n${additions.length ? `\nAdditions:\n${additions.join("\n")}` : ""}${removals.length ? `${additions.length ? "\n" : ""}\nRemovals:\n${removals.join("\n")}` : ""}`;
            const buffer = Buffer.from(fileContent, "utf-8");

            const file = new Discord.AttachmentBuilder(buffer, { name: "result.txt" });

            await i.edit({ embeds: [], files: roleChanges.length ? [file] : [] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
