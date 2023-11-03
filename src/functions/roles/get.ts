import ExtendedClient from "../../classes/ExtendedClient";
import { Role, Snowflake } from "discord.js";

import { roles as role } from "../../config";

import Roles from "../../classes/Roles";

export default async function (userId: Snowflake, client: ExtendedClient & any): Promise<Roles> {
    try {
        // Fetch user roles
        const guild = await client.guilds.fetch(client.config_main.primaryGuild);
        const roles = guild.members.cache.get(userId).roles.cache.map((role: Role) => role.id) || [];

        return {
            owner: roles.includes(role.owner),
            botAdmin: roles.includes(role.botAdmin),
            admin: roles.includes(role.admin),
            dev: roles.includes(role.dev),
            mod: roles.includes(role.mod),
            helper: roles.includes(role.helper),
            staff: roles.includes(role.staff),
            betaTester: roles.includes(role.betaTester),
            donator: roles.includes(role.donator)
        }
    } catch(err) {
        return {
            owner: false,
            botAdmin: false,
            admin: false,
            dev: false,
            mod: false,
            helper: false,
            staff: false,
            betaTester: false,
            donator: false
        }
    }
}
