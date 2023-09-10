import { EmbedBuilder } from "discord.js";
import { embeds, emojis as emoji } from "../config";

const noPermissionButton = new EmbedBuilder()
    .setColor(embeds.error)
    .setDescription(`${emoji.cross} You do not have permission to run this button!`)

const noPermissionCommand = new EmbedBuilder()
    .setColor(embeds.error)
    .setDescription(`${emoji.cross} You do not have permission to run this command!`)

export {
    noPermissionButton,
    noPermissionCommand
}
