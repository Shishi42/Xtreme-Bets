const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  name: "data",
  description: "Result Generation",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",

  async run(bot, message, args) {

    message.deferReply()

    if(message.member != bot.owner) return

    data = [[
      "id",
      "name",
      "balance",
      "total bets",
      "win bets",
      "lost bets",
      "%win",
      "%lost",
      "enter date",
      "lost date",
      "biggest bet",
      "smallest bet",
      "average bet",
      "biggest win",
      "biggest win label",
      "biggest win vote",
      "biggest lost",
      "biggest lost label",
      "biggest lost vote",
      "biggest cheese ratio",
      "biggest cheese value",
      "biggest cheese label",
      "biggest cheese vote",
      "biggest desillusion ratio",
      "biggest desillusion value",
      "biggest desillusion label",
      "biggest desillusion vote",

    ]]

    members = await bot.Members.findAll()

    for(member of members){
      member_bettings = await bot.Bettings.findAll({ where: { member_id: member.dataValues.member_id }})
      total_bet = member_bettings.length

      if(total_bet != 0){
        id = member.dataValues.member_id
        user = await bot.users.fetch(id)
        name = user.tag
        balance = parseInt(member.dataValues.balance)
        enter = member.dataValues.createdAt.toString().substring(4, 24)
        if(balance == 0) lost = member.dataValues.updatedAt.toString().substring(4, 24)
        else lost = "None"

        win_bet = 0
        lost_bet = 0
        big_bet = 0
        small_bet = 10000
        big_win = 0
        big_lost = 10000
        sum = 0
        cheese = 0
        cheese_value = 0
        desillusion = 0
        desillusion_value = 0

        for(betting of member_bettings){
          bet = await bot.Bets.findOne({ where: { bet_id: betting.dataValues.bet_id }})
          if(bet.dataValues.final == betting.dataValues.vote) win_bet++
          else lost_bet++

          sum += parseInt(betting.dataValues.value)

          if(parseInt(betting.dataValues.value) > big_bet) big_bet = parseInt(betting.dataValues.value)
          if((parseInt(betting.dataValues.value) * parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])) > big_win && bet.dataValues.final == betting.dataValues.vote){
            big_win = (parseInt(betting.dataValues.value) * parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)]))
            big_win_label = bet.dataValues.label
            big_win_vote = betting.dataValues.vote
            if(bet.dataValues.result_type == "MVP"){
              mvp = await bot.users.fetch(bet.dataValues.choices.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])
              big_win_vote += " | "+mvp.tag
            } else if(bet.dataValues.result_type == "GROUP"){
              team1 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[0])-1].substring(1)}})
              team2 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[1])-1].substring(1)}})
              team3 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[2])-1].substring(1)}})
              team4 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[3])-1].substring(1)}})
              big_win_vote += ` | ${team1.dataValues.team_alias}-${team2.dataValues.team_alias}-${team3.dataValues.team_alias}-${team4.dataValues.team_alias}`
            } else if(bet.dataValues.result_type == "MATCH"){
              player1 = await bot.users.fetch(bet.dataValues.choices.split(",")[0])
              player2 = await bot.users.fetch(bet.dataValues.choices.split(",")[2])
              big_win_vote += ` | ${betting.dataValues.vote == "1" ? `(${player1.tag})` : player1.tag} - ${betting.dataValues.vote == "N" ? `(N)` : "N"} - ${betting.dataValues.vote == "2" ? `(${player2.tag})` : player2.tag}`
            }
          }
          if(parseInt(betting.dataValues.value) < small_bet) small_bet = parseInt(betting.dataValues.value)
          if(parseInt(betting.dataValues.value) < big_lost && bet.dataValues.final != betting.dataValues.vote){
            big_lost = parseInt(betting.dataValues.value)
            big_lost_label = bet.dataValues.label
            big_lost_vote = betting.dataValues.vote
            if(bet.dataValues.result_type == "MVP"){
              mvp = await bot.users.fetch(bet.dataValues.choices.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])
              big_lost_vote += " | "+mvp.tag
            } else if(bet.dataValues.result_type == "GROUP"){
              team1 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[0])-1].substring(1)}})
              team2 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[1])-1].substring(1)}})
              team3 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[2])-1].substring(1)}})
              team4 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[3])-1].substring(1)}})
              big_lost_vote += ` | ${team1.dataValues.team_alias}-${team2.dataValues.team_alias}-${team3.dataValues.team_alias}-${team4.dataValues.team_alias}`
            } else if(bet.dataValues.result_type == "MATCH"){
              player1 = await bot.users.fetch(bet.dataValues.choices.split(",")[0])
              player2 = await bot.users.fetch(bet.dataValues.choices.split(",")[2])
              big_lost_vote += ` | ${betting.dataValues.vote == "1" ? `(${player1.tag})` : player1.tag} - ${betting.dataValues.vote == "N" ? `(N)` : "N"} - ${betting.dataValues.vote == "2" ? `(${player2.tag})` : player2.tag}`
            }
          }
          if(bet.dataValues.final == betting.dataValues.vote && cheese < parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])){
            cheese = parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])
            cheese_value = parseInt(betting.dataValues.value) * cheese
            cheese_label = bet.dataValues.label
            cheese_vote = betting.dataValues.vote
            if(bet.dataValues.result_type == "MVP"){
              mvp = await bot.users.fetch(bet.dataValues.choices.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])
              cheese_vote += " | "+mvp.tag
            } else if(bet.dataValues.result_type == "GROUP"){
              team1 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[0])-1].substring(1)}})
              team2 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[1])-1].substring(1)}})
              team3 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[2])-1].substring(1)}})
              team4 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[3])-1].substring(1)}})
              cheese_vote += ` | ${team1.dataValues.team_alias}-${team2.dataValues.team_alias}-${team3.dataValues.team_alias}-${team4.dataValues.team_alias}`
            } else if(bet.dataValues.result_type == "MATCH"){
              player1 = await bot.users.fetch(bet.dataValues.choices.split(",")[0])
              player2 = await bot.users.fetch(bet.dataValues.choices.split(",")[2])
              cheese_vote += ` | ${betting.dataValues.vote == "1" ? `(${player1.tag})` : player1.tag} - ${betting.dataValues.vote == "N" ? `(N)` : "N"} - ${betting.dataValues.vote == "2" ? `(${player2.tag})` : player2.tag}`
            }
          }
          if(bet.dataValues.final != betting.dataValues.vote && desillusion < parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])){
            desillusion = parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])
            desillusion_value = betting.dataValues.value
            desillusion_label = bet.dataValues.label
            desillusion_vote = betting.dataValues.vote
            if(bet.dataValues.result_type == "MVP"){
              mvp = await bot.users.fetch(bet.dataValues.choices.split(",")[bet.dataValues.results.split(",").indexOf(betting.dataValues.vote)])
              desillusion_vote += " | "+mvp.tag
            } else if(bet.dataValues.result_type == "GROUP"){
              team1 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[0])-1].substring(1)}})
              team2 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[1])-1].substring(1)}})
              team3 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[2])-1].substring(1)}})
              team4 = await bot.Teams.findOne({ where: { team_id: bet.dataValues.choices.split(",")[parseInt(betting.dataValues.vote.split("-")[3])-1].substring(1)}})
              desillusion_vote += ` | ${team1.dataValues.team_alias}-${team2.dataValues.team_alias}-${team3.dataValues.team_alias}-${team4.dataValues.team_alias}`
            } else if(bet.dataValues.result_type == "MATCH"){
              player1 = await bot.users.fetch(bet.dataValues.choices.split(",")[0])
              player2 = await bot.users.fetch(bet.dataValues.choices.split(",")[2])
              desillusion_vote += ` | ${betting.dataValues.vote == "1" ? `(${player1.tag})` : player1.tag} - ${betting.dataValues.vote == "N" ? `(N)` : "N"} - ${betting.dataValues.vote == "2" ? `(${player2.tag})` : player2.tag}`
            }
          }
        }
        win_per = win_bet/total_bet * 100
        lost_per = lost_bet/total_bet * 100
        bet_avg = (sum / total_bet)

        if(!win_bet){
          big_win = "None"
          cheese = "None"
          cheese_value = "None"
        } else {
          big_win = parseInt(big_win)
          cheese = cheese.toFixed(2)
          cheese_value = parseInt(cheese_value)
        }
        if(!lost_bet){
          big_lost = "None"
          desillusion = "None"
          desillusion_value = "None"
        } else {
          big_lost = parseInt(big_lost)
          desillusion = desillusion.toFixed(2)
          desillusion_value = parseInt(desillusion_value)
        }
        res = [
          id,
          name,
          balance,
          total_bet,
          win_bet,
          lost_bet,
          win_per.toFixed(2),
          lost_per.toFixed(2),
          enter,
          lost,
          big_bet,
          small_bet,
          bet_avg.toFixed(2),
          big_win,
          big_win_label,
          big_win_vote,
          big_lost,
          big_lost_label,
          big_lost_vote,
          cheese,
          cheese_value,
          cheese_label,
          cheese_vote,
          desillusion,
          desillusion_value,
          desillusion_label,
          desillusion_vote,
        ]
        data.push(res)
      }
    }

    fs.writeFile('data.csv', data.map(function(d){return d.join()}).join('\n'), err => console.log(err))

    // require(`../events/.log.js`).run(bot, `[DATA] : **${message.member.user.username}**`)
    return message.editReply({content: `Done.`, ephemeral: true})
  }
}
