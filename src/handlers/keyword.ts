import ExtendedClient from "../classes/ExtendedClient";

import fs from "fs";
import { getDirs } from "../util/functions";

export = async (client: ExtendedClient) => {
    async function loadRoot() {
        const files = fs.readdirSync(`./dist/keywords`).filter((file: String) => file.endsWith(".js"));

        for(const file of files) {
            const keyword = require(`../keywords/${file}`);

            keyword.name = file.replace(".js", "");

            client.keywords.set(keyword.keywords, keyword);

            console.log(`Loaded Keyword: ${keyword.title}`);
        }
    }

    async function loadDir(dir: String) {
        const files = fs.readdirSync(`./dist/keywords/${dir}`).filter((file: String) => file.endsWith(".js"));

        for(const file of files) {
            const keyword = require(`../keywords/${dir}/${file}`);

            keyword.name = file.replace(".js", "");

            client.keywords.set(keyword.keywords, keyword);

            console.log(`Loaded Keyword: ${keyword.title}`);
        }
    }

    await loadRoot();
    (await getDirs("./dist/keywords")).forEach((dir: String) => loadDir(dir));
}
