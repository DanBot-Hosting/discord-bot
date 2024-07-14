import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

import Keyword from "../../classes/Keyword";

import { emojis as emoji } from "../../config";
import fs from "fs";
import { getDirs } from "../../util/functions";

const command: Command = {
    name: "faq",
    description: "Frequently asked questions.",
    options: [
        {
            type: 3,
            name: "question",
            description: "The question to get an answer for.",
            required: true,
            autocomplete: true
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    requiredRoles: [],
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const question = interaction.options.get("question").value as string;

            const keyword: Keyword = client.keywords.find((keyword: Keyword) => keyword.name === question);

            if(!keyword) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} That keyword doesn't exist.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const response = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle(keyword.title)
                .setDescription(keyword.response)

            await interaction.editReply({ embeds: [response] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    },
    async autocomplete(interaction: AutocompleteInteraction, client: ExtendedClient) {
        const option = interaction.options.getFocused(true);

        if(option.name === "question") {
            let choices: any = [];

            async function loadRoot() {
                const files = fs.readdirSync(`./dist/keywords`).filter((file: String) => file.endsWith(".js"));

                for(const file of files) {
                    const keyword = require(`../../keywords/${file}`);

                    choices.push({
                        name: keyword.title,
                        value: keyword.name
                    })
                }
            }

            async function loadDir(dir: String) {
                const files = fs.readdirSync(`./dist/keywords/${dir}`).filter((file: String) => file.endsWith(".js"));

                for(const file of files) {
                    const keyword = require(`../../keywords/${dir}/${file}`);

                    choices.push({
                        name: keyword.title,
                        value: keyword.name
                    })
                }
            }

            await loadRoot();
            (await getDirs("./dist/keywords")).forEach((dir: String) => loadDir(dir));

            choices = choices.filter((choice: any) => choice.name.toLowerCase().includes(option.value.toLowerCase()));

            if(choices.length > 25) choices.length = 25;

            await interaction.respond(choices);
        }
    }
}

export = command;
