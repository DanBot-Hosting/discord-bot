import ExtendedClient from "../../classes/ExtendedClient";

import ping from "ping";
import updateMessage from "./update-message";

const servers: any = [
    { name: "PNode 1", host: "pnode1.danbot.host", type: "performance" },
    { name: "PNode 2", host: "pnode2.danbot.host", type: "performance" },
    { name: "Dono 1", host: "dono-01.danbot.host", type: "donator" },
    { name: "Dono 2", host: "dono-02.danbot.host", type: "donator" },
    { name: "Dono 3", host: "dono-03.danbot.host", type: "donator" },
    { name: "Dono 4", host: "dono-04.danbot.host", type: "donator" },
    { name: "Dono 5", host: "dono-05.danbot.host", type: "donator" },
    { name: "AU 1", host: "139.99.171.195", type: "vpn" },
    { name: "FR 1", host: "176.31.125.135", type: "vpn" },
    { name: "US 1", host: "69.197.129.206", type: "vpn" }
]

export default async function (client: ExtendedClient): Promise<ServerStatus[]> {
    const statuses: ServerStatus[] = [];

    for(const server of servers) {
        const res = await ping.promise.probe(server.host, { timeout: 3 });

        if(res.alive) {
            statuses.push({
                server: server,
                result: res,
                online: true
            })
        } else {
            statuses.push({
                server: server,
                result: res,
                online: false
            })
        }
    }

    await updateMessage(statuses, client);
    return statuses;
}

export type ServerStatus = {
    server: {
        name: string;
        host: string;
        type: string;
    }
    result: ping.PingResponse;
    online: boolean;
}
