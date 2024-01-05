import ExtendedClient from "../../classes/ExtendedClient";

import axios from "axios";

import { servers } from "../../configs/server-status";
import updateMessage from "./update-message";

export default async function (client: ExtendedClient): Promise<ServerStatus[]> {
    const statuses: ServerStatus[] = [];

    for(const server of servers) {
        if(!server.enabled) return;

        await axios.post(`http://${server.pingLocal}/?ip=${server.host}&port=${server.port}`, {}, { timeout: 2000 }).then(res => {
            statuses.push({
                server: server,
                online: isNaN(res.data.ping) ? 0 : Number(res.data.ping)
            })
        }).catch(() => {
            statuses.push({
                server: server,
                online: 0
            })
        })

        // const res = await ping.promise.probe(server.host, { timeout: 5 });

        // statuses.push({
        //     server: server,
        //     online: res.alive
        // })
    }

    await updateMessage(statuses, client);
    return statuses;
}

export type ServerStatus = {
    server: {
        name: string;
        host: string;
        port: string;
        type: string;
        pingLocal: string;
        showPing: boolean;
        enabled: boolean;
    }
    // result: ping.PingResponse;
    online: number;
}
