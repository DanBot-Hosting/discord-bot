import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { GuildChannel } from "discord.js";

import { main } from "../../config";
import TestingChannel from "../../models/TestingChannel";

const event: Event = {
    name: "channelDelete",
    once: false,
    async execute(client: ExtendedClient, Discord: typeof import("discord.js"), channel: GuildChannel) {
        try {
            if(!channel.guild) return;
            if(channel.guild.id !== main.primaryGuild) return;

            if(channel.name.startsWith("testing-")) {
                const data = await TestingChannel.findOne({ channel: channel.id });

                // If the channel was deleted manually, remove the database entry.
                if(data) await data.delete();
            }
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
