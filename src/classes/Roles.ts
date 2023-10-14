export default class Roles {
    public owner: Boolean;
    public botAdmin: Boolean;
    public admin: Boolean;
    public dev: Boolean;
    public mod: Boolean;
    public helper: Boolean;
    public staff: Boolean;
    public donator: Boolean;
}

export type Role = "owner" | "botAdmin" | "admin" | "dev" | "mod" | "helper" | "staff" | "donator";

export function getRoleArray(object: Roles): Role[] {
    const roles: Role[] = [];

    if(object.owner) roles.push("owner");
    if(object.botAdmin) roles.push("botAdmin");
    if(object.admin) roles.push("admin");
    if(object.dev) roles.push("dev");
    if(object.mod) roles.push("mod");
    if(object.helper) roles.push("helper");
    if(object.staff) roles.push("staff");
    if(object.donator) roles.push("donator");

    return roles;
}

export function getRoleWithEmoji(role: Role): string {
    if(role === "owner") return "👑 Owner";
    if(role === "botAdmin") return "🤖 Bot Admin";
    if(role === "admin") return "⚒️ Admin";
    if(role === "dev") return "💻 Developer";
    if(role === "mod") return "🔨 Moderator";
    if(role === "helper") return "🆘 Helper";
    if(role === "staff") return "👔 Staff";
    if(role === "donator") return "💸 Donator";
}
