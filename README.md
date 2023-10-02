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
  - [ ] Server info
  - [ ] Server list
  - [ ] Server count
  - [ ] Move files from one server to another (if possible)
  - [ ] Start/restart/stop a server
- [x] Add Sentry
  - [x] Add error tracking on the bot
  - [ ] Add Sentry bot to the server and set it up in a channel
- [x] Add staff commands
  - [x] Fix donator role assigning command
    - Checks and adds the donator role to users that are meant to have it but do not have it
  - [x] Premium add/fix/remove/set commands
  - [x] Data transfer command
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
- [x] Testing channels
  - [x] Creation of testing channels
  - [x] Deletion of testing channels
    - [x] Auto-delete all channels after 24 hours
  - [x] Adding/removing users from a testing channel
- [ ] Proxy management
  - [ ] Proxy/unproxying domains
    - For proxying, use modals
    - Allow user to provide an optional note
  - [ ] Domain list
  - [ ] Info about a specific proxied domain
    - What server it is attached to, SSL status, etc
  - [ ] Remove proxied domains when a server is deleted
- [ ] Client management
  - [ ] Suspend users (administrator only)
  - [ ] Delete own client account
  - [ ] Creating an account (in DMs)
  - [ ] Resetting password
  - [x] New credit system
  - [ ] Linking/unlinking account
- [x] Starboard
