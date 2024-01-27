import ExtendedClient from "../classes/ExtendedClient";

import { VoiceChannel } from "discord.js";

import { categories, channels, main } from "../config";

export default async function (client: ExtendedClient) {
    const channel = channels.vcStats;
    const guild = client.guilds.cache.get(main.primaryGuild);

    const boosts = guild.channels.cache.get(channel.boosts) as VoiceChannel;
    const bots = guild.channels.cache.get(channel.bots) as VoiceChannel;
    const members = guild.channels.cache.get(channel.members) as VoiceChannel;
    const staff = guild.channels.cache.get(channel.staff) as VoiceChannel;
    const tickets = guild.channels.cache.get(channel.tickets) as VoiceChannel;

    const ticketCategories = Object.values(categories.tickets);

    const stats = {
        boosts: guild.premiumSubscriptionCount,
        bots: guild.members.cache.filter(member => member.user.bot).size,
        members: guild.memberCount,
        staff: guild.members.cache.filter(member => member.roles.cache.has(client.config_roles.staff)).size,
        tickets: guild.channels.cache.filter(channel => channel.name.startsWith("🎫╏") && ticketCategories.includes(channel.parentId)).size
    }

    // Update stats
    await boosts.setName(`Boosts » ${stats.boosts}`);
    await bots.setName(`Bots » ${stats.bots}`);
    await members.setName(`Members » ${stats.members}`);
    await staff.setName(`Staff » ${stats.staff}`);
    await tickets.setName(`Tickets » ${stats.tickets}`);
}
