const Discord = require("discord.js")

module.exports = {

  name: "sync",
  description: "Data Sync",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",

  async run(bot, message, args) {

    ids =
    ["1012306317890814022",
    "1012302626660032623",
    "1012302627075280916",
    "1012306014361616384",
    "1012302555134570506",
    "1012302627083669645",
    "1012302578446520330",
    "1012306088059744307",
    "1012305995118153738",
    "1012306116304187413",
    "1012305976327688192",
    "1086348047103033425",
    "1012306070770823199",
    "1012306163825651767",
    "1074969062515421224",
    "1012306136193585193"]

    ids.forEach(id => {
      bot.Teams.create({team_id: bot.guilds.cache.get(bot.wc).roles.cache.get(id).id, team_alias: bot.guilds.cache.get(bot.wc).roles.cache.get(id).name})
      const Role = bot.guilds.cache.get(bot.wc).roles.cache.find(role => role.id == id)
      let team_players = bot.guilds.cache.get(bot.wc).members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member)

      team_players.forEach(player => {
        bot.Players.create({player_id: player.user.id, player_alias: player.user.tag, player_team: bot.guilds.cache.get(bot.wc).roles.cache.get(id).id})
      })
    })

  }
}
