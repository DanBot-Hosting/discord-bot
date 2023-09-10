import { ColorResolvable, EmojiResolvable, Snowflake } from "discord.js";

const channels: { [key: string]: Snowflake } = {}

const embeds: { [key: string]: ColorResolvable } = {
    default: "#0096FF",
    error: "#E74C3C"
}

const emojis: { [key: string]: EmojiResolvable } = {
    connection_bad: "<:connection_bad:1149583879179612250>",
    connection_excellent: "<:connection_excellent:1149583873538260992>",
    connection_good: "<:connection_good:1149583875551539280>",
    cross: "<:cross:1149583869956329492>",
    reply: "<:reply:1149583863333519390>",
    tick: "<:tick:1149583861416730695>"
}

const main = {
    legacyPrefix: "dbh!" as string,
    owner: "137624084572798976" as Snowflake // Dan
}

const roles: { [key: string]: Snowflake } = {
    admin: "898041747219828796",
    dev: "898041747597295667",
    donator: "898041754564046869",
    helper: "898041750545903707",
    mod: "898041748817842176",
    staff: "898041751099539497",
    sysAdmin: "898041743566594049"
}

export {
    channels,
    embeds,
    emojis,
    main,
    roles
}

export default {
    channels,
    embeds,
    emojis,
    main,
    roles
}
