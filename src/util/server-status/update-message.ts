import ExtendedClient from "../../classes/ExtendedClient";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { ServerStatus } from "./checker";
import { serverTypes } from "../../configs/server-status";

export default async function (statuses: ServerStatus[], client: ExtendedClient) {
    const channel = await client.channels.fetch(client.config_channels.nodeStatus) as TextChannel;
    const recentMessages = await channel.messages.fetch({ limit: 10 });
    const message = recentMessages.find((msg: Message) => msg.author.id === client.user.id && msg.embeds.length > 0);

    // Create embed
    const status = new EmbedBuilder()
        .setTitle("DBH Service Status")
        .setTimestamp()

    const data: any = {};

    for(const status of statuses) {
        const type = serverTypes[status.server.type] || status.server.type;

        if(type) {
            // Create array for the server type if it doesn't exist
            if(!data[type]) data[type] = [];

            // Push server data
            data[type].push({
                name: status.server.name,
                showPing: status.server.showPing ? ` [${Math.round(status.online).toFixed(0)}ms]` : "",
                online: status.online
            })
        }
    }

    // Add fields to embed
    for(const item in data) {
        status.addFields({ name: `${item}`, value: data[item].map((i: Server) => `${i.name}: ${i.online ? `🟢 Online${i.showPing}` : "🔴 **Offline**"}`).join("\n") });
    }

    // Sort fields based on the type order in serverTypes
    status.data.fields.sort((a, b) => Object.keys(serverTypes).indexOf(a.name) - Object.keys(serverTypes).indexOf(b.name));

    // Send or edit message
    message ? await message.edit({ embeds: [status] }) : await channel.send({ embeds: [status] });
}

type Server = {
    name: string;
    showPing: boolean;
    online: number;
}
