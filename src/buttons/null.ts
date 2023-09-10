// This file is only here as a placeholder so the bot doesn't crash.
// We can remove this file once we actually add some buttons.

import Button from "../classes/Button";
import ExtendedClient from "../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

const button: Button = {
    name: "null",
    startsWith: false,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: any) {
        try {} catch(err) {
            client.logButtonError(err, interaction, Discord);
        }
    }
}

export = button;
