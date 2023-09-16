import ExtendedClient from "../../classes/ExtendedClient";
import { Role, Snowflake } from "discord.js";

import { roles as role } from "../../config";

import Roles from "../../classes/Roles";

export default async function (userId: Snowflake, client: ExtendedClient & any): Promise<Roles> {
    // Fetch user roles
    const roles = client.guilds.cache.get(client.config_main.primaryGuild)?.members.cache.get(userId)?.roles.cache.map((role: Role) => role.id) || [];

    return {
        owner: roles.includes(role.owner),
        sysAdmin: roles.includes(role.sysAdmin),
        admin: roles.includes(role.admin),
        dev: roles.includes(role.dev),
        mod: roles.includes(role.mod),
        helper: roles.includes(role.helper),
        staff: roles.includes(role.staff),
        donator: roles.includes(role.donator)
    }
}
