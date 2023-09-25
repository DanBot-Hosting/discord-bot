import { ButtonInteraction, Snowflake } from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

import User from "../models/User";

export async function add(user: Snowflake, amount: number, client: ExtendedClient): Promise<number> {
    const data = await User.findOne({ _id: user }) || new User({ _id: user, premium_count: 0, premium_used: 0 });

    if(data.premium_count + amount > 10000) throw new Error(`A user cannot have more than 10000 premium servers.`);

    data.premium_count += amount;
    await data.save();

    const guild = client.guilds.cache.get(client.config_main.primaryGuild);
    const member = guild.members.cache.get(user);

    member.roles.add(client.config_roles.donator).catch(() => {});

    return data.premium_count;
}

export async function fix(user: Snowflake): Promise<number> {
    const data = await User.findOne({ _id: user }) || { premium_used: 0 };

    // TODO: Fetch user's premium servers & fix count
    return data.premium_used;
}

export async function get(user: Snowflake): Promise<PremiumData> {
    const data = await User.findOne({ _id: user }) || { premium_count: 0, premium_used: 0 };

    return { count: data.premium_count, used: data.premium_used };
}

export async function remove(user: Snowflake, amount: number, client: ExtendedClient): Promise<number> {
    const data = await User.findOne({ _id: user }) || new User({ _id: user, premium_count: 0, premium_used: 0 });

    if(data.premium_count < amount) throw new Error(`<@${user}> does not have that many premium servers to remove.`);
    if(data.premium_used > data.premium_count - amount) throw new Error(`You cannot remove more premium servers from <@${user}> than they have used.`);

    data.premium_count -= amount;
    await data.save();

    if(data.premium_count === 0) {
        const guild = client.guilds.cache.get(client.config_main.primaryGuild);
        const member = guild.members.cache.get(user);

        member.roles.remove(client.config_roles.donator).catch(() => {});
    }

    return data.premium_count;
}

export async function set(user: Snowflake, amount: number, client: ExtendedClient): Promise<number> {
    const data = await User.findOne({ _id: user }) || new User({ _id: user, premium_count: 0, premium_used: 0 });

    if(amount > 10000) throw new Error(`A user cannot have more than 10000 premium servers.`);
    if(data.premium_used > amount) throw new Error(`You cannot set <@${user}>'s premium server count to less than they have used.`);

    data.premium_count = amount;
    await data.save();

    if(data.premium_count === 0) {
        const guild = client.guilds.cache.get(client.config_main.primaryGuild);
        const member = guild.members.cache.get(user);

        member.roles.remove(client.config_roles.donator).catch(() => {});
    }

    return data.premium_count;
}

export type PremiumData = {
    count: number;
    used: number;
}
