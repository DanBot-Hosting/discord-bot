import { Snowflake } from "discord.js";

import User from "../models/User";

export async function add(user: Snowflake, amount: number): Promise<number> {
    const data = await User.findOne({ _id: user }) || new User({ _id: user, premium_servers: 0 });

    data.premium_servers += amount;
    await data.save();

    return data.premium_servers;
}

export async function get(user: Snowflake): Promise<number> {
    const data = await User.findOne({ _id: user }) || { premium_servers: 0 };

    return data.premium_servers;
}

export async function remove(user: Snowflake, amount: number): Promise<number> {
    const data = await User.findOne({ _id: user }) || new User({ _id: user, premium_servers: 0 });

    if(data.premium_servers < amount) throw new Error(`<@${user}> does not have enough premium servers.`);

    data.premium_servers -= amount;
    await data.save();

    return data.premium_servers;
}
