const Discord = require('discord.js')
const config = require("./config.json")
const bot = new Discord.Client({intents: 3276799})
const cron = require("cron")

const commands_loader = require("./loaders/commands_loader")
const events_loader = require("./loaders/events_loader")

bot.commands = new Discord.Collection()

bot.color = config.bot_color
bot.owner = config.bot_owner
bot.wc = config.wc_server
bot.log = config.log_channel

commands_loader(bot)
events_loader(bot)

bot.login(config.token)
