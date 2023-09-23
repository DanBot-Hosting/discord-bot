import { ColorResolvable, Snowflake } from "discord.js";

const channels = {
    announcements: "898050443446464532",
    changelogs: "960242064338092202",
    donations: "898041841939783732",
    gettingStarted: "898041837535776788",
    messageLogs: "898041913947602945",
    modLogs: "898041920071299142",
    nodeStatus: "898041845878247487",
    otherLogs: "898041920071299142",
    rules: "898041835002400768",
    welcome: "898041844871618600"
}

const embeds = {
    default: "#0096FF" as ColorResolvable,
    error: "#E74C3C" as ColorResolvable
}

const emojis = {
    connection_bad: "<:connection_bad:1152422134124130417>",
    connection_excellent: "<:connection_excellent:1152422118995279882>",
    connection_good: "<:connection_good:1152422128457625670>",
    cross: "<:cross:1152422111030292561>",
    reply: "<:reply:1152422114792571070>",
    tick: "<:tick:1152422108291399761>"
}

const main = {
    appealEmail: "dan@danbot.host",
    dmAllowed: [
        "137624084572798976", // Dan
        "757296951925538856", // DIBSTER
        "853158265466257448" // William
    ],
    evalAllowed: [
        "137624084572798976", // Dan
        "757296951925538856", // DIBSTER
        "853158265466257448" // William
    ],
    legacyPrefix: "DBHB!" as string,
    primaryGuild: "639477525927690240" as Snowflake, // DanBot Hosting
}

const roles = {
    admin: "898041747219828796",
    dev: "898041747597295667",
    donator: "898041754564046869",
    helper: "898041750545903707",
    mod: "898041748817842176",
    owner: "898041741695926282",
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
