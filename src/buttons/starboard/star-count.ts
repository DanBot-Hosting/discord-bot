import Button from "../../classes/Button";
import ExtendedClient from "../../classes/ExtendedClient";
import { ButtonInteraction } from "discord.js";

const button: Button = {
    name: "star-count",
    startsWith: false,
    requiredRoles: [],
    async execute(interaction: ButtonInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        // Ignore the interaction
        await interaction.deferUpdate();
    }
}

export = button;
