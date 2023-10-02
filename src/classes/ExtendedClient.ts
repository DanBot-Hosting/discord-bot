import { Client, Collection, Snowflake } from "discord.js";
import { channels, embeds, main, roles } from "../config";
import Command from "./Command";
import Event from "./Event";
import LegacyCommand from "./LegacyCommand";
import * as Sentry from "@sentry/node";

export default class ExtendedClient extends Client {
    public autoKick: boolean;
    public buttons: Collection<string, any>;
    public commandIds: Collection<string, Snowflake>;
    public commands: Collection<string, Command>;
    public config_channels: typeof channels;
    public config_embeds: typeof embeds;
    public config_main: typeof main;
    public config_roles: typeof roles;
    public credit: typeof import("../util/credit");
    public events: Collection<string, Event>;
    public lastPoll: number;
    public legacyCommands: Collection<string, LegacyCommand>;
    public logButtonError: Function;
    public logCommandError: Function;
    public logContextError: Function;
    public logError: Function;
    public logLegacyError: Function;
    public sentry: typeof Sentry;
    public validPermissions: string[];
}
