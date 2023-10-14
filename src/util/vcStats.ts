import ExtendedClient from "../classes/ExtendedClient";

import { VoiceChannel } from "discord.js";

import { channels, main } from "../config";
const channel = channels.vcStats;

export default async function (client: ExtendedClient) {
    const guild = client.guilds.cache.get(main.primaryGuild);

    const boosts = guild.channels.cache.get(channel.boosts) as VoiceChannel;
    const bots = guild.channels.cache.get(channel.bots) as VoiceChannel;
    const members = guild.channels.cache.get(channel.members) as VoiceChannel;
    const staff = guild.channels.cache.get(channel.staff) as VoiceChannel;
    const tickets = guild.channels.cache.get(channel.tickets) as VoiceChannel;
    const totalMembers = guild.channels.cache.get(channel.totalMembers) as VoiceChannel;

    const stats = {
        boosts: guild.premiumSubscriptionCount,
        bots: guild.members.cache.filter(member => member.user.bot).size,
        members: guild.members.cache.size,
        staff: guild.members.cache.filter(member => member.roles.cache.has(client.config_roles.staff)).size,
        tickets: guild.channels.cache.filter(channel => channel.name.startsWith("🎫╏")).size,
        totalMembers: guild.memberCount
    }

    // Update stats
    await boosts.setName(`Boosts: ${stats.boosts}`);
    await bots.setName(`Bots: ${stats.bots}`);
    await members.setName(`Members: ${stats.members}`);
    await staff.setName(`Staff: ${stats.staff}`);
    await tickets.setName(`Tickets: ${stats.tickets}`);
    await totalMembers.setName(`Total Members: ${stats.totalMembers}`);
}