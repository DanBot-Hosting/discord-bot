import { Role } from "./Roles";
import { ContextMenuCommandType, PermissionResolvable, Permissions } from "discord.js";

export default class ContextCommand {
    public name: string;
    public type: ContextMenuCommandType;
    public default_member_permissions: Permissions;
    public botPermissions: PermissionResolvable[];
    public requiredRoles: Role[];
    public cooldown: number;
    public enabled: boolean;
    public deferReply: boolean;
    public ephemeral: boolean;
    public execute: Function;
}
