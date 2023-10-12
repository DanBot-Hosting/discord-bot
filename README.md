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
- [x] Add Sentry
  - [x] Add error tracking on the bot
  - [ ] Add Sentry bot to the server and set it up in a channel
- [x] Add staff commands
  - [x] Fix donator role assigning command
    - Checks and adds the donator role to users that are meant to have it but do not have it
  - [x] Premium add/fix/remove/set commands
  - [x] Data transfer command
- [x] Add moderation commands
  - [x] Ban/unban
  - [x] Kick
  - [x] Mute/unmute
  - [x] Purge
- [x] Guild member add event
  - [x] Welcome messages
  - [x] Auto-kick accounts under 10 days old
    - [x] Add command to temp-disable
- [x] Add logging
  - [x] Message delete
  - [x] Message edit
  - [x] Nickname changes
- [x] Add DM functionality
  - [x] Allow specific users to send messages using the bot through DMs
- [x] Testing channels
  - [x] Creation of testing channels
  - [x] Deletion of testing channels
    - [x] Auto-delete all channels after 24 hours
  - [x] Adding/removing users from a testing channel
- [x] Client management
  - [x] New credit system
- [x] Starboard
