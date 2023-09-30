import ExtendedClient from "../classes/ExtendedClient";

import TestingChannel from "../models/TestingChannel";

import { main } from "../config";

export default async function (client: ExtendedClient) {
    const data = await TestingChannel.find({});

    const guild = client.guilds.cache.get(main.primaryGuild);

    for(const item of data) {
        if(!guild.channels.cache.get(item.channel)) await item.delete();

        // Delete channels after 24 hours
        if(Date.now() - item.created >= 86400000) {
            const channel = guild.channels.cache.get(item.channel) as import("discord.js").TextChannel;

            if(channel) await channel.delete();

            await item.delete();
        }
    }
}
