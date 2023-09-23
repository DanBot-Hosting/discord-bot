import ExtendedClient from "../../classes/ExtendedClient";

import ping from "ping";
import updateMessage from "./update-message";

const servers: any = [
    { name: "Node 4", ip: "n4.danbot.host", type: "free" },
    { name: "Node 5", ip: "n5.danbot.host", type: "free" },
    { name: "Node 6", ip: "n6.danbot.host", type: "free" },
    { name: "Node 7", ip: "n7.danbot.host", type: "free" },
    { name: "Node 8", ip: "n8.danbot.host", type: "free" },
    { name: "PNode 1", ip: "pnode1.danbot.host", type: "premium" },
    { name: "PNode 2", ip: "pnode2.danbot.host", type: "premium" },
    { name: "Dono 1", ip: "dono-01.danbot.host", type: "donator" },
    { name: "Dono 2", ip: "dono-02.danbot.host", type: "donator" },
    { name: "Dono 3", ip: "dono-03.danbot.host", type: "donator" },
    { name: "Dono 4", ip: "dono-04.danbot.host", type: "donator" },
    { name: "Dono 5", ip: "dono-05.danbot.host", type: "donator" },
    { name: "AU 1", ip: "139.99.171.195", type: "vpn" },
    { name: "FR 1", ip: "176.31.125.135", type: "vpn" },
    { name: "US 1", ip: "69.197.129.206", type: "vpn" }
]

export default async function (client: ExtendedClient): Promise<ServerStatus[]> {
    const statuses = [];

    for(const server of servers) {
        const res = await ping.promise.probe(server.ip, { timeout: 3 });

        if(res.alive) {
            statuses.push({ server: server, online: true });
        } else {
            statuses.push({ server: server, online: false });
        }
    }

    await updateMessage(statuses, client);
    return statuses;
}

export type ServerStatus = {
    server: {
        name: string;
        ip: string;
        type: "free" | "premium" | "donator" | "vpn";
    }
    online: boolean;
}
