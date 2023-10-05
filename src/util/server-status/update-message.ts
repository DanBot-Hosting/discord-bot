import ExtendedClient from "../../classes/ExtendedClient";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { ServerStatus } from "./checker";

const serverTypes: any = {
    "performance": "Performance Nodes",
    "donator": "Donator Nodes",
    "vpn": "VPN Servers"
}

export default async function (statuses: ServerStatus[], client: ExtendedClient) {
    console.log(`[serverStatus] Updating server status message...`);

    const channel = await client.channels.fetch(client.config_channels.nodeStatus) as TextChannel;
    const recentMessages = await channel.messages.fetch({ limit: 10 });
    const message = recentMessages.find((msg: Message) => msg.author.id === client.user.id && msg.embeds.length > 0);

    const status = new EmbedBuilder()
        .setTitle("Server Status")
        .setDescription(`<t:${Date.now().toString().slice(0, -3)}:f> (<t:${Date.now().toString().slice(0, -3)}:R>)`)
        .setTimestamp()

    const nodeIPs = new EmbedBuilder()
        .setTitle("IP Addresses")

    const data: any = {};

    for(const status of statuses) {
        const type = serverTypes[status.server.type] || status.server.type;

        if(type) {
            if(!data[type]) data[type] = [];

            data[type].push({
                name: status.server.name,
                ip: status.result.numeric_host,
                online: status.online
            })
        }
    }

    for(const item in data) {
        status.addFields({ name: `${item}`, value: data[item].map((item: Server) => `${item.name}: ${item.online ? "🟢 Online" : "🔴 **Offline**"}`).join("\n"), inline: true });
        nodeIPs.addFields({ name: `${item}`, value: data[item].map((item: Server) => `${item.name}: \`${item.ip}\``).join("\n"), inline: true });
    }

    if(message) {
        // Log to console
        console.log(`[serverStatus] Found existing message, editing...`);

        await message.edit({ embeds: [status, nodeIPs] });
    } else {
        // Log to console
        console.log(`[serverStatus] No existing message found, sending new message...`);

        channel.send({ embeds: [status, nodeIPs] });
    }

    // Log to console
    console.log(`[serverStatus] Server status message updated!`);
}

export type Server = {
    name: string;
    ip: string;
    online: boolean;
}
