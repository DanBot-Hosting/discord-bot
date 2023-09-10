import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Interaction, PermissionResolvable } from "discord.js";

import buttonHandler from "../../util/interaction/button";
import commandHandler from "../../util/interaction/command";

const event: Event = {
    name: "interactionCreate",
    once: false,
    async execute(client: ExtendedClient, Discord: any, interaction: Interaction) {
        try {
            const requiredPerms: PermissionResolvable = ["SendMessages", "EmbedLinks"];

            if(!interaction.guild) return;
            if(!interaction.guild.members.me.permissions.has(requiredPerms)) return;

            if(interaction.isButton()) return await buttonHandler(client, Discord, interaction);
            if(interaction.isCommand() && !interaction.isMessageContextMenuCommand() && !interaction.isUserContextMenuCommand()) return await commandHandler(client, Discord, interaction);
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
