import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";

import { TextChannel } from "discord.js";

import globalCommands from "../../scripts/global-commands";
import reactionRoles from "../../configs/reactionRoles";

const event: Event = {
    name: "ready",
    once: true,
    async execute(client: ExtendedClient) {
        try {
            // Login Message
            console.log(`Logged in as: ${client.user.tag.endsWith("#0") ? client.user.username : client.user.tag}`);

            // Register Commands
            await globalCommands(client);

            // React on reaction roles
            const rrChannel = client.channels.cache.get(client.config_channels.reactionRoles) as TextChannel;

            for(const message in reactionRoles) {
                const msg = await rrChannel.messages.fetch(message);

                if(!msg) continue;

                console.log(`[reactionRoles] Reacting on reaction roles message: ${message}`);

                // Remove all reactions
                await msg.reactions.removeAll();

                for(const emoji in reactionRoles[message]) {
                    await msg.react(emoji);
                }
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
