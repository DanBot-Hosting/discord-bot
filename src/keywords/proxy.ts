import Keyword from "../classes/Keyword";

const keyword: Keyword = {
    title: "When will the proxy be back up?",
    keywords: ["when", "will", "the", "proxy", "be", "back", "up", "online"],
    requiredKeywords: ["proxy"],
    response: "We are currently unsure when the proxy will be back up. Keep an eye on <#898050443446464532> for updates.",
    minimumKeywords: 3,
    matchAll: false,
    enabled: true
}

export = keyword;
