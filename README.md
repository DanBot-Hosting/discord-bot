# DBH Discord Bot
A rewrite of [DanBotHostingStats](https://github.com/DanBot-Hosting/DanBotHostingStats) in TypeScript and with slash commands.

**This project is a work in progress, please see the [To-Do List](#to-do-list).**

## Maintainers
- **DIBSTER**
  - Email: dibster@danbot.host
  - GitHub: [DEV-DIBSTER](https://github.com/DEV-DIBSTER)
- **William**
  - Email: william@danbot.host
  - GitHub: [WilliamDavidHarrison](https://github.com/WilliamDavidHarrison)

## Disclaimer
- Leaking of this code will result in an **immediate demotion**.

## To-Do List
- [x] Add prefix command deprecation message
- [ ] Add panel-related commands
  - [ ] Server creation
  - [ ] Server deletion
  - [ ] Server info (information about a server, could be useful)
  - [ ] Server list
  - [ ] Server count
- [x] Add Sentry for error tracking
- [ ] Add staff commands
  - [ ] Premium fix command (possibly one which fixes all users?)
  - [ ] Premium add/remove commands
- [ ] Add logging
  - [ ] Message delete
  - [ ] Message edit
- [ ] Add DM functionality
  - [ ] Allow users with the bot system administrator role to send messages using the bot through DMs
- [ ] Proxy management
  - [ ] Proxy/unproxying domains
  - [ ] Domain list
  - [ ] Info about a specific proxied domain
    - [ ] What server it is attached to, SSL status, etc
  - [ ] Remove proxied domains when a server is deleted
- [ ] Client management
  - [ ] Suspend users (administrator only)
  - [ ] Delete own client account
  - [ ] Creating an account (in DMs)
  - [ ] Resetting password
  - [ ] Premium server count
  - [ ] Linking/unlinking account
