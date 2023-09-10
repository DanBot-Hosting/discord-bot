import { Client, Collection, Snowflake } from "discord.js";
import { channels, embeds, main, roles } from "../config";
import * as Sentry from "@sentry/node";

export default class ExtendedClient extends Client {
    public buttons: Collection<string, any>;
    public commandIds: Collection<string, Snowflake>;
    public commands: Collection<string, any>;
    public config_channels: typeof channels;
    public config_embeds: typeof embeds;
    public config_main: typeof main;
    public config_roles: typeof roles;
    public contextCommands: Collection<string, any>;
    public events: Collection<string, any>;
    public logButtonError: Function;
    public logCommandError: Function;
    public logContextError: Function;
    public logError: Function;
    public sentry: typeof Sentry;
    public validPermissions: string[];
}
