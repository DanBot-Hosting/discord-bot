import { ColorResolvable, Snowflake } from "discord.js";

const categories = {
    testingChannels: "1158553893299556463"
}

const channels = {
    announcements: "898050443446464532",
    changelogs: "960242064338092202",
    devQuestions: "1083142107977486389",
    donations: "898041841939783732",
    gettingStarted: "898041837535776788",
    messageLogs: "898041913947602945",
    modLogs: "898041920071299142",
    nodeStatus: "898041845878247487",
    otherLogs: "898041920071299142",
    rules: "898041835002400768",
    starboard: "898041905340907581", // temporarily staff commands
    welcome: "898041844871618600"
}

const embeds = {
    default: "#0096FF" as ColorResolvable,
    error: "#E74C3C" as ColorResolvable,
    gold: "#F1C40F" as ColorResolvable
}

const emojis = {
    connection_bad: "<:connection_bad:1152422134124130417>",
    connection_excellent: "<:connection_excellent:1152422118995279882>",
    connection_good: "<:connection_good:1152422128457625670>",
    cross: "<:cross:1152422111030292561>",
    ping: "<a:ping:1156039801523404850>",
    reply: "<:reply:1152422114792571070>",
    tick: "<:tick:1152422108291399761>"
}

const main = {
    appealEmail: "dan@danbot.host",
    disablePermCheck: [
        "853158265466257448" // William
    ],
    dmAllowed: [
        "137624084572798976", // Dan
        "757296951925538856", // DIBSTER
        "853158265466257448" // William
    ],
    legacyPrefix: "DBHB!" as string,
    primaryGuild: "639477525927690240" as Snowflake, // DanBot Hosting
    suggestionChannels: [
        "976371313901965373", // #vpn-suggestions
        "980595293768802327" // #staff-suggestions
    ]
}

const premium = {
    price: 0.5 // Price per premium server (USD)
}

const roles = {
    admin: "898041747219828796",
    botAdmin: "898041743566594049",
    dev: "898041747597295667",
    donator: "898041754564046869",
    helper: "898041750545903707",
    mod: "898041748817842176",
    owner: "898041741695926282",
    pollPing: "898041781927682090",
    pollPingAllowed: "1157497265708093520",
    staff: "898041751099539497"
}

const starboard = {
    allowed: [
        "898041849783148585", // #lounge
        "898041857550995506", // #memes
        "898041861040664576", // #setups
        "898041858666668092", // #pets
        "898041865616650240", // #dono-lounge
        "898041875192234054", // #vps-chat
        "898354771927400538" // #beta-lounge
    ],
    emoji: "⭐", // The emoji to react with
    threshold: 3 // Minimum reactions required to post on starboard
}

export {
    categories,
    channels,
    embeds,
    emojis,
    main,
    premium,
    roles,
    starboard
}

export default {
    categories,
    channels,
    embeds,
    emojis,
    main,
    premium,
    roles,
    starboard
}
