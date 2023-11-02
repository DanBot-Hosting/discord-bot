import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Channel, GuildChannel } from "discord.js";

import { main } from "../../config";
import TestingChannel from "../../models/TestingChannel";

const event: Event = {
    name: "channelDelete",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), channel: Channel & GuildChannel) {
        try {
            if(!channel.guild) return;
            if(channel.guild.id !== main.primaryGuild) return;

            if(channel.name.startsWith("testing-")) {
                const data = await TestingChannel.findOne({ channel: channel.id });

                // If the channel was deleted manually, remove the database entry.
                if(data) {
                    // Log to console
                    console.log(`[channelDelete] [testingChannels] ${data.id} (${data.channel}) was deleted manually, deleting from database...`);

                    await data.deleteOne();

                    // Log to console
                    console.log(`[channelDelete] [testingChannels] Deleted testing channel ${data.id} (${data.channel}) from the database.`);
                }
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
