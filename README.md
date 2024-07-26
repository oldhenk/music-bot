> # Project overview

> As a core contributor to [discord-player](https://discord-player.js.org), I've dedicated significant time and effort to this project. My familiarity with the core principles of discord-player has allowed me to incorporate many of its concepts and best practices into this project, serving as a valuable reference for library users. I've strived to ensure the project is user-friendly and intuitive. Your suggestions and feedback are always welcome - feel free to open an issue or submit a pull request.

---

# Music Bot

A complete example of a discord music bot including database, web dashboard, and more powered by [discord.js](https://discord.js.org/#/) and [discord-player](https://discord-player.js.org).

# Features

- Easy to use
- Customizable
- Covers most of the concepts as well as best practices of discord-player
- Slash commands
- Web dashboard
- Custom playlists management
- Queue management
- Persistent configurations
- Equalizer

and more...

# Setting up the bot

## Setup with Docker

- Pull the [docker image](https://hub.docker.com/repository/docker/oldhenk/groovy2/general)
- Expose ports 3000 and 5000
- Edit environment variables:
   - DISCORD_TOKEN="YOUR_DISCORD_TOKEN_HERE"
   - DATABASE_URL="mongodb url"
   - REDIS_HOST="your-redis-host"
   - REDIS_PORT="redis port"
   - REDIS_PASSWORD="your-redis-password"
   - COREPACK_ENABLE_STRICT=0
- (optional) if you want other users from access the web interface change local to you domain or ip(dont forget to port forward)
   - WEB_INTERFACE_URL="http://local:3000"
   - NEXT_PUBLIC_GATEWAY_URL="ws://localhost:5000"
   - NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"

## Manual setup

- Run `pnpm install --frozen-lockfile` to install all dependencies

### Starting the bot

- Rename `.env.example` to `.env` and fill out the values
- Put your bot token in `DISCORD_TOKEN`
- Put mongodb database credentials in `DATABASE_URL` (You can get one for free from [Mongodb Atlas](https://www.mongodb.com/atlas))
- Put your redis config in `REDIS_*` (you can use memurai for windows)
- Run `pnpm bot dev` to start the bot in development mode

### Starting the website

- Rename `.env.example` to `.env` and fill out the values
- Run `pnpm run --filter web dev` to start the website in development mode

You can now use `/web` command to get magic link to the website. You are able to add songs to the queue, skip songs, change volume and more from the website itself. You can also do this from Discord using slash commands.

![Web Interface](https://github.com/oldhenk/music-bot/blob/master/assets/image.png?raw=true)

## Support me on Patreon

If you like this project, consider supporting me on Patreon. This will help me to keep working on projects like this and make them even better.

[![Patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/twlite)
