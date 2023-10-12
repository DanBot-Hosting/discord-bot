export default class Keyword {
    public name?: string;
    public title: string;
    public keywords: string[];
    public requiredKeywords: string[];
    public response: string;
    public minimumKeywords: number;
    public matchAll: boolean;
    public enabled: boolean;
}
