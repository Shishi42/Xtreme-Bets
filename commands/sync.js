const Discord = require("discord.js")

module.exports = {

  name: "sync",
  description: "Data Sync",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",

  async run(bot, message, args) {

    group_stage =
    [["1012306317890814022","A"],
    ["1012302626660032623","D"],
    ["1012302627075280916","D"],
    ["1012306014361616384","C"],
    ["1012302555134570506","B"],
    ["1012302627083669645","C"],
    ["1012302578446520330","A"],
    ["1012306088059744307","B"],
    ["1012305995118153738","C"],
    ["1012306116304187413","B"],
    ["1012305976327688192","D"],
    ["1086348047103033425","D"],
    ["1012306070770823199","B"],
    ["1012306163825651767","A"],
    ["1074969062515421224","A"],
    ["1012306136193585193","C"]]

    knockout_stage =
    [["1012302627075280916","X"],
    ["1012306014361616384","X"],
    ["1012302578446520330","X"],
    ["1012306088059744307","X"],
    ["1012305995118153738","X"],
    ["1012305976327688192","X"],
    ["1012306070770823199","X"],
    ["1074969062515421224","X"]]

    allstar_stage = [["1137051846406578176","X"], ["1137052068155236384","X"]]

    dev_stage =
    [["841348652693585981","X"],
    ["1064236599195467898","X"]]

    captain = "1012657654289661963"

    group_stage.forEach(id => {
      bot.Teams.create({team_id: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).id, team_name: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).name, team_alias: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).name.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'').trim(), team_group: id[1]})
      const Role = bot.guilds.cache.get(bot.wc).roles.cache.find(role => role.id == id[0])
      let team_players = bot.guilds.cache.get(bot.wc).members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member)

      team_players.forEach(player => {
        bot.Players.create({player_id: player.user.id, player_alias: player.user.tag, player_team: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).id, is_captain: player.roles.cache.get(captain) ? 1 : 0})
      })
    })

    allstar_stage.forEach(id => {
      bot.Teams.create({team_id: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).id, team_name: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).name, team_alias: bot.guilds.cache.get(bot.wc).roles.cache.get(id[0]).name.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'').trim(), team_group: id[1]})
    })


    require(`../events/.log.js`).run(bot, `[SYNC] : **${message.member.user.username}**`)
    return message.reply({content: `Done.`, ephemeral: true})
  }
}
