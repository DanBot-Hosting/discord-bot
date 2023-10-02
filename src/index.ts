require("dotenv").config();

import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.sentry_dsn,
    tracesSampleRate: 1.0
})

import Discord from "discord.js";
import ExtendedClient from "./classes/ExtendedClient";
import config from "./config";

const client = new ExtendedClient({
    intents: 3276799,
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.ThreadMember,
        Discord.Partials.User
    ],
    presence: {
        activities: [
            {
                name: "panel.danbot.host » /help",
                type: Discord.ActivityType.Custom
            }
        ],
        status: "online"
    }
})

// Error Handling
process.on("unhandledRejection", (err: Error) => Sentry.captureException(err));

// Connect to Database
import database from "./util/database";
database();

// Configs
client.config_channels = config.channels;
client.config_embeds = config.embeds;
client.config_main = config.main;
client.config_roles = config.roles;

// Handlers
client.buttons = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.keywords = new Discord.Collection();
client.legacyCommands = new Discord.Collection();

import { loadHandlers } from "./util/functions";
loadHandlers(client);

// Check and update server status every 60 seconds
import checker from "./util/server-status/checker";
checker(client);
setInterval(() => checker(client), 60000);

// Check and update testing channel data every 5 minutes
import testingChannels from "./util/testing-channels";
testingChannels(client);
setInterval(() => testingChannels(client), 300000);

// Login
client.login(process.env.token);

// Constants
client.autoKick = true;
client.commandIds = new Discord.Collection();
client.credit = require("./util/credit");
client.lastPoll = 0;
client.sentry = Sentry;

client.validPermissions = [
    "CreateInstantInvite",
    "KickMembers",
    "BanMembers",
    "Administrator",
    "ManageChannels",
    "ManageGuild",
    "AddReactions",
    "ViewAuditLog",
    "PrioritySpeaker",
    "Stream",
    "ViewChannel",
    "SendMessages",
    "SendTTSMessages",
    "ManageMessages",
    "EmbedLinks",
    "AttachFiles",
    "ReadMessageHistory",
    "MentionEveryone",
    "UseExternalEmojis",
    "ViewGuildInsights",
    "Connect",
    "Speak",
    "MuteMembers",
    "DeafenMembers",
    "MoveMembers",
    "UseVAD",
    "ChangeNickname",
    "ManageNicknames",
    "ManageRoles",
    "ManageWebhooks",
    "ManageEmojisAndStickers",
    "UseApplicationCommands",
    "RequestToSpeak",
    "ManageEvents",
    "ManageThreads",
    "CreatePublicThreads",
    "CreatePrivateThreads",
    "UseExternalStickers",
    "SendMessagesInThreads",
    "UseEmbeddedActivities",
    "ModerateMembers",
    "ViewCreatorMonetizationAnalytics",
    "UseSoundboard",
    "SendVoiceMessages"
]
