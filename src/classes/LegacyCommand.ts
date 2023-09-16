import { Role } from "./Roles";
import { PermissionResolvable } from "discord.js";

export default class LegacyCommand {
    public name: string;
    public description: string;
    public aliases: string[];
    public botPermissions: PermissionResolvable[];
    public requiredRoles: Role[];
    public cooldown: number;
    public enabled: boolean;
    public execute: Function;
}
