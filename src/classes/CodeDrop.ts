import { Snowflake } from "discord.js";

export default class CodeDrop {
    public channel: Snowflake;
    public message: Snowflake;
    public credits: number;
    public claimed: boolean;
}
