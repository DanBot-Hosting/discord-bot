import ExtendedClient from "../../classes/ExtendedClient";
import { EmbedBuilder, TextChannel } from "discord.js";
import { ServerStatus } from "./checker";

const serverTypes: any = {
    "performance": "Performance Nodes",
    "donator": "Donator Nodes",
    "vpn": "VPN Servers"
}

export default async function (statuses: ServerStatus[], client: ExtendedClient) {
    const channel = await client.channels.fetch(client.config_channels.nodeStatus) as TextChannel;
    const recentMessages = await channel.messages.fetch({ limit: 10 });
    const message = recentMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

    const embed = new EmbedBuilder()
        .setTitle("DanBot Hosting Status")
        .setDescription(`<t:${Date.now().toString().slice(0, -3)}:f> (<t:${Date.now().toString().slice(0, -3)}:R>)`)
        .setFooter({ text: "Updated every 60 seconds." })
        .setTimestamp()

    const data: any = {};

    for(const status of statuses) {
        const type = serverTypes[status.server.type] || status.server.type;

        if(type) {
            if(!data[type]) data[type] = [];

            data[type].push({
                name: status.server.name,
                online: status.online
            })
        }
    }

    for(const item in data) {
        embed.addFields({ name: `***${item}***`, value: data[item].map((i: any) => `${i.name}: ${i.online ? "🟢 Online" : "🔴 **Offline**"}`).join("\n"), inline: true });
    }

    if(message) {
        await message.edit({ embeds: [embed] });
    } else {
        channel.send({ embeds: [embed] });
    }
}
