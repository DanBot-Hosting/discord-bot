import ExtendedClient from "../../classes/ExtendedClient";
import { Snowflake } from "discord.js";

import Roles from "../../classes/Roles";

export default async function (userId: Snowflake, client: ExtendedClient): Promise<Roles> {
    return {
        owner: client.config_main.owner === userId,
        // TODO: add role checking
        admin: false,
        dev: false,
        mod: false,
        helper: false,
        staff: false,
        donator: false
    }
}
