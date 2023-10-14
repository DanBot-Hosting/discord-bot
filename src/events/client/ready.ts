import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";

import { TextChannel } from "discord.js";

import globalCommands from "../../scripts/global-commands";
import reactionRoles from "../../configs/reactionRoles";
import testingChannels from "../../util/testingChannels";
import vcStats from "../../util/vcStats";

const event: Event = {
    name: "ready",
    once: true,
    async execute(client: ExtendedClient) {
        try {
            // Login Message
            console.log(`Logged in as: ${client.user.tag.endsWith("#0") ? client.user.username : client.user.tag}`);

            // Register Commands
            await globalCommands(client);

            // Check and update testing channel data every 5 minutes
            await testingChannels(client);
            setInterval(async () => await testingChannels(client), 300000);

            // Check and update VC Stats every 5 minutes
            await vcStats(client);
            setInterval(async () => await vcStats(client), 300000);

            // React on reaction roles
            const rrChannel = client.channels.cache.get(client.config_channels.reactionRoles) as TextChannel;

            for(const message in reactionRoles) {
                const msg = await rrChannel.messages.fetch(message);

                if(!msg) continue;

                console.log(`[reactionRoles] Reacting on message: ${message}`);

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
