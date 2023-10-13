import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

const command: Command = {
    name: "avatar",
    description: "Get a user's avatar.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user who's avatar to get.",
            required: false
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: [],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const user = interaction.options.getUser("user") || interaction.user;

            const avatar = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle(`${user.globalName || user.username}'s avatar`)
                .setImage(user.displayAvatarURL({ extension: "png", forceStatic: false, size: 1024 }))

            if(user.id === interaction.user.id) avatar.setTitle("Your Avatar");

            // Buttons with links to different avatar formats
            const buttons: any = new Discord.ActionRowBuilder()
                .addComponents (
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("PNG")
                        .setURL(user.displayAvatarURL({ extension: "png", forceStatic: true })),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("JPG")
                        .setURL(user.displayAvatarURL({ extension: "jpg", forceStatic: true })),

                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("WEBP")
                        .setURL(user.displayAvatarURL({ extension: "webp", forceStatic: true }))
                )

            // If the user has a gif avatar, add a button for the gif format
            if(user.displayAvatarURL({ forceStatic: false }).endsWith(".gif")) {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("GIF")
                        .setURL(user.displayAvatarURL({ extension: "gif", forceStatic: false }))
                )
            }

            await interaction.editReply({ embeds: [avatar], components: [buttons] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
