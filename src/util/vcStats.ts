import ExtendedClient from "../classes/ExtendedClient";

import axios from "axios";
import { VoiceChannel } from "discord.js";

import { categories, channels, main } from "../config";

export default async function (client: ExtendedClient) {
    const channel = channels.vcStats;
    const guild = client.guilds.cache.get(main.primaryGuild);

    const boosts = guild.channels.cache.get(channel.boosts) as VoiceChannel;
    const bots = guild.channels.cache.get(channel.bots) as VoiceChannel;
    const clients = guild.channels.cache.get(channel.clients) as VoiceChannel;
    const members = guild.channels.cache.get(channel.members) as VoiceChannel;
    const servers = guild.channels.cache.get(channel.servers) as VoiceChannel;
    const staff = guild.channels.cache.get(channel.staff) as VoiceChannel;
    const tickets = guild.channels.cache.get(channel.tickets) as VoiceChannel;

    const ticketCategories = Object.values(categories.tickets);

    const stats = {
        boosts: guild.premiumSubscriptionCount,
        bots: guild.members.cache.filter(member => member.user.bot).size,
        clients: await getUserCount(),
        members: guild.memberCount,
        servers: await getServerCount(),
        staff: guild.members.cache.filter(member => member.roles.cache.has(client.config_roles.staff)).size,
        tickets: guild.channels.cache.filter(channel => channel.name.startsWith("🎫╏") && ticketCategories.includes(channel.parentId)).size
    }

    // Update stats
    await boosts.setName(`Boosts » ${stats.boosts}`);
    await bots.setName(`Bots » ${stats.bots}`);
    await clients.setName(`Clients » ${stats.clients}`);
    await members.setName(`Members » ${stats.members}`);
    await servers.setName(`Servers » ${stats.servers}`);
    await staff.setName(`Staff » ${stats.staff}`);
    await tickets.setName(`Tickets » ${stats.tickets}`);
}

async function getUserCount() {
    const res = await axios({
        url: `https://${main.panel}/api/application/users`,
        method: "GET",
        maxRedirects: 5,
        headers: {
            Accept: "Application/vnd.pterodactyl.v1+json",
            Authorization: `Bearer ${process.env.panel_application_api_key}`,
            "Content-Type": "application/json"
        }
    }).catch(() => null);

    return res.data.meta.pagination.total;
}

async function getServerCount() {
    const res = await axios({
        url: `https://${main.panel}/api/application/servers`,
        method: "GET",
        maxRedirects: 5,
        headers: {
            Accept: "Application/vnd.pterodactyl.v1+json",
            Authorization: `Bearer ${process.env.panel_application_api_key}`,
            "Content-Type": "application/json"
        }
    }).catch(() => null);

    return res.data.meta.pagination.total;
}
