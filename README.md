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
- [x] Add staff commands
  - [x] Premium fix command
    - [x] Fix count using a button for users
  - [x] Fix donator role assigning command
    - Checks and adds the donator role to users that are meant to have it but do not have it
  - [x] Premium add/remove/set commands
- [x] Guild member add event
  - [x] Welcome messages
  - [x] Auto-kick accounts under 10 days old
    - [x] Add command to temp-disable
- [ ] Add logging
  - [x] Message delete
  - [ ] Message edit
  - [ ] Nickname changes
- [x] Add DM functionality
  - [x] Allow specific users to send messages using the bot through DMs
- [ ] Proxy management
  - [ ] Proxy/unproxying domains
  - [ ] Domain list
  - [ ] Info about a specific proxied domain
    - What server it is attached to, SSL status, etc
  - [ ] Remove proxied domains when a server is deleted
- [ ] Client management
  - [ ] Suspend users (administrator only)
  - [ ] Delete own client account
  - [ ] Creating an account (in DMs)
  - [ ] Resetting password
  - [ ] Premium server count
  - [ ] Linking/unlinking account
