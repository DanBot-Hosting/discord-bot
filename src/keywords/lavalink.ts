import Keyword from "../classes/Keyword";

const keyword: Keyword = {
    title: "Do you support Lavalink servers?",
    keywords: ["do", "you", "support", "lavalink", "server", "servers"],
    requiredKeywords: ["support", "lavalink"],
    response: "We do support creating Lavalink servers, however the RAM usage **must be limited to 2GB**.\nInstead, it is recommended to use our public Lavalink which has no restrictions:\n\n**IP**: \`69.197.129.206\`\n**Port**: \`1221\`\n**Password**: \`DBH\`",
    minimumKeywords: 3,
    matchAll: false,
    enabled: true
}

export = keyword;
