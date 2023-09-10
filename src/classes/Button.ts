import { Role } from "./Roles";

export default class Button {
    public name: string;
    public startsWith: boolean;
    public requiredRoles: Role[];
    public execute: Function;
}
