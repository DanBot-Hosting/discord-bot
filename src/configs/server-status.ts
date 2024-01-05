export const pingers: any = {
    "UK": "128.254.225.55:1105"
}

export const servers: Server[] = [
    // Performance Nodes
    { name: "PNode 1", host: "128.254.225.84", port: "22", type: "performance", pingLocal: pingers.UK, showPing: true, enabled: true },
    { name: "PNode 2", host: "128.254.225.56", port: "22", type: "performance", pingLocal: pingers.UK, showPing: true, enabled: true },
    // Donator Nodes
    { name: "Dono-01", host: "128.254.225.85", port: "22", type: "donator", pingLocal: pingers.UK, showPing: true, enabled: true },
    { name: "Dono-02", host: "128.254.225.78", port: "22", type: "donator", pingLocal: pingers.UK, showPing: true, enabled: true },
    { name: "Dono-03", host: "128.254.225.58", port: "22", type: "donator", pingLocal: pingers.UK, showPing: true, enabled: true },
    // VPN Servers
    { name: "US 1", host: "69.197.129.206", port: "22", type: "vpn", pingLocal: pingers.UK, showPing: false, enabled: true },
    // Servers
    { name: "US 1", host: "69.197.129.202", port: "22", type: "server", pingLocal: pingers.UK, showPing: false, enabled: true },
    { name: "EU 1", host: "88.99.95.48", port: "22", type: "server", pingLocal: pingers.UK, showPing: false, enabled: true },
    // DBH Services
    { name: "Grafana", host: "169.155.244.165", port: "443", type: "service", pingLocal: pingers.UK, showPing: false, enabled: true },
    { name: "Pterodactyl (Public)", host: "104.167.215.213", port: "443", type: "service", pingLocal: pingers.UK, showPing: false, enabled: true },
    { name: "Pterodactyl (Core)", host: "69.30.249.51", port: "443", type: "service", pingLocal: pingers.UK, showPing: false, enabled: true },
    { name: "Proxmox", host: "69.197.129.202", port: "8006", type: "service", pingLocal: pingers.UK, showPing: false, enabled: true },
    { name: "VPN API", host: "69.30.249.51", port: "1110", type: "service", pingLocal: pingers.UK, showPing: false, enabled: true }
]

export const serverTypes: any = {
    "performance": "Performance Nodes",
    "donator": "Donator Nodes",
    "vpn": "VPN Servers",
    "server": "Dedicated Servers",
    "service": "DBH Services"
}

type Server = {
    name: string;
    host: string;
    port: string;
    type: "performance" | "donator" | "vpn" | "server" | "service";
    pingLocal: string;
    showPing: boolean;
    enabled: boolean;
}
