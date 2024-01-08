import { ColorResolvable } from "discord.js";

const categories = {
    tickets: {
        high: "1160713638743658577",
        medium: "1160713549685989406",
        low: "1160710296986460171",
        unknown: "1160716485065445406"
    }
}

const channels = {
    accountLogs: "1168034234179539044",
    changelogs: "960242064338092202",
    donations: "898041841939783732",
    donatorLogs: "898041923544162324",
    gettingStarted: "898041837535776788",
    github: "898041843902742548",
    messageLogs: "898041913947602945",
    modLogs: "898041915600162826",
    nodeStatus: "898041845878247487",
    otherLogs: "898041920071299142",
    reactionRoles: "898041838701781013",
    rules: "898041835002400768",
    starboard: "1158582673879597177",
    ticketLogs: "898041922109722635",
    vcStats: {
        boosts: "898041831495974983",
        bots: "898041830241882112",
        members: "898041827561730069",
        staff: "898041828870348800",
        tickets: "898041832569700362",
        totalMembers: "898041826810949632"
    },
    voice: {
        dbh: "898041822406905876"
    },
    welcome: "898041844871618600"
}

const embeds = {
    default: "#4460BB" as ColorResolvable,
    error: "#E74C3C" as ColorResolvable,
    gold: "#F1C40F" as ColorResolvable
}

const emojis = {
    connection_bad: "<:connection_bad:1152422134124130417>",
    connection_excellent: "<:connection_excellent:1152422118995279882>",
    connection_good: "<:connection_good:1152422128457625670>",
    cross: "<:cross:1152422111030292561>",
    dbh_check: "<:DBH_Check:1124437152625868810>",
    dbh_cross: "<:DBH_Cross:1158710201529139281>",
    dot: "<:dot:1164732475675783278>",
    ping: "<a:ping:1156039801523404850>",
    reply: "<:reply:1152422114792571070>",
    tick: "<:tick:1152422108291399761>"
}

const main = {
    appealEmail: "dan@danbot.host",
    autoCrosspost: [
        "898327108898684938", // #server-status
        "1165422634226434180" // #bot-status
    ],
    botAPI: "bot-api.danbot.host",
    legacyPrefix: "DBHB!",
    logIgnoredChannels: [
        "898041845878247487" // #node-status
    ],
    nodeStatus: false,
    primaryGuild: "639477525927690240", // DanBot Hosting
    suggestionChannels: [
        "976371313901965373", // #vpn-suggestions
        "980595293768802327" // #staff-suggestions
    ],
    suggestionReactions: false // Whether or not to enable reactions in suggestion channels
}

const premium = {
    price: 0.5 // Price per premium server (USD)
}

const roles = {
    admin: "898041747219828796",
    betaTester: "898041755419693126",
    botAdmin: "898041743566594049",
    bots: "898041770082959432",
    dev: "898041747597295667",
    donator: "898041754564046869",
    helper: "898041750545903707",
    member: "898041757168697375",
    mod: "898041748817842176",
    owner: "898041741695926282",
    staff: "898041751099539497",
    ticketPing: "983825037050142782"
}

const starboard = {
    allowed: [
        "898041849783148585", // #lounge
        "898041854262648842", // #thank-you-dan
        "898041857550995506", // #memes
        "898041861040664576", // #setups
        "898041858666668092", // #pets
        "898041865616650240", // #dono-lounge
        "898354771927400538" // #beta-lounge
    ],
    emoji: "⭐", // The emoji to react with
    threshold: 5 // Reactions required to post on the starboard
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
