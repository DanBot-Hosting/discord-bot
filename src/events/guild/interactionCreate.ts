import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Interaction, PermissionResolvable } from "discord.js";

import buttonHandler from "../../util/interaction/button";
import commandHandler from "../../util/interaction/command";

const event: Event = {
    name: "interactionCreate",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), interaction: Interaction) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            // Ignore interactions not in a guild
            if(!interaction.guild) return;
            // Ignore interactions if the bot does not have the required permissions
            if(!interaction.guild.members.me.permissions.has(requiredPerms)) return;

            // Button handler
            if(interaction.isButton()) return await buttonHandler(client, Discord, interaction);
            // Command handler
            if(interaction.isCommand() && !interaction.isMessageContextMenuCommand() && !interaction.isUserContextMenuCommand()) return await commandHandler(client, Discord, interaction);
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
