import ExtendedClient from "../classes/ExtendedClient";

import TestingChannel from "../models/TestingChannel";

import { main } from "../config";

export default async function (client: ExtendedClient) {
    const data = await TestingChannel.find({});

    const guild = client.guilds.cache.get(main.primaryGuild);

    for(const item of data) {
        if(!guild.channels.cache.get(item.channel)) {
            console.log(`[testingChannels] ${item.id} (${item.channel}) does not exist, deleting from database...`);

            await item.delete();
            continue;
        }

        // Delete channels after 24 hours
        if(Date.now() - item.created >= 86400000) {
            // Log to console
            console.log(`[testingChannels] ${item.id} (${item.channel}) is older than 24 hours, deleting...`);

            const channel = guild.channels.cache.get(item.channel) as import("discord.js").TextChannel;

            if(channel) await channel.delete();

            await item.delete();

            // Log to console
            console.log(`[testingChannels] Deleted testing channel ${item.id} (${item.channel}).`);
        }
    }
}
