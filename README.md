# X-Wars Original Battle Report Parser & Discord Bot

This is a Discord bot that parses the original battle reports from the game [X-Wars](https://original.xwars.net) and posts them to a Discord channel. To see it in action visit the X-Wars Discord Server (https://discord.gg/MutQ4zPD).

## Usage

You can add this bot to your own Discord server with the following [Link](https://discord.com/api/oauth2/authorize?client_id=1113485760604147784&permissions=&scope=bot). It will post processed battle report into a channel which name contains `battle-reports`. Additionally to reports parsed by users the bot will automatically post notable battle reports.

### Commands
  - `/kb <url> <private> <format>`: Reads the report from the URL and replys with the parsed report. The bot will post the report publically unless private=true ist added. Optionally you can specify the message format.
  - `/config default_format <user|bot> <format>`: Gets or sets the default message format for either reports parsed by a user or automaticalle by the bot. You need the privilege to manage channels to use this command.
  
### Message Formats
  - `text`: detailed text report
  - `oneline`: short report that fits into one line

## Development

This bot was created within a few hours, please feel free to tidy it up and make it better, 
PRs more than welcome!

The bot is written for NodeJS v18+ and has several files in the `src` directory:
  - `app.ts`: main application and Discord bot which listens to commands
  - `deploy-commands.ts`: deploys the commands configuration to the Discord server based on files in the `commands/` folder
  - `validator_test.ts`: parses reports from `test/reports/*.html` and report errors
  - `command.ts`: manages loading and execution of commands from the `commands/` folder
  - `parser.ts`: retrieves the battle report, extracts data from the report and saves it anonymized to disk 
  - `message.ts`: creates different message formats
  - `guild-config.ts`: database wrapper for guild configuration
  - `validator.ts`: provides validators for json data from reports
  - `model/report`: models used by the json-object-mapper to map the JSON data from reports

### .env variables
 - `DISCORD_BOT_TOKEN`: bot token from discord developer portal
 - `DISCORD_BOT_CLIENT_ID`: application id from discord developer portal
 - `GUILD_CONFIG_DATABASE`: path to sqlite database relative to `prisma/` - format `file:./path/to/db/`
 - `DEBUG`: reports will be sent as private message - default `false`
 - `HTTP_PORT`: port for http api - default `3000`
 - `REPORT_URL_BASE`: base url for parsed reports - default `https://kb.original.xwars.net/`
 - `REPORT_TOKEN`: bearer token to push reports through `report/` - default `no-token-defined`