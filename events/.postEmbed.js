const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  async run(bot, bet, post, update = false) {

    bet_embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: 'Xtreme Bets', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
      .setTitle(bet.dataValues.label)
      .setDescription("Possible vote :")
      .setImage(bet.dataValues.image_url)
      .setTimestamp()
      .setFooter({text: `A IESXWC bot`, iconURL: bot.guilds.cache.get(bot.wc).iconURL()})

    if (bet.dataValues.result_type == "MATCH" || bet.dataValues.result_type == "FIXTURE" || bet.dataValues.result_type == "TEAM" || bet.dataValues.result_type == "MVP") {

      results = bet.dataValues.results.split(",")
      ratios = bet.dataValues.ratios.split(",")

      for(i = 0; i < results.length; i++){

        total = 0

        value = (bet.dataValues.choices.split(",")[i] == "DRAW") ? "DRAW" : "<@"+bet.dataValues.choices.split(",")[i]+">"
        nb = await bot.Bettings.count({where: { bet_id: bet.dataValues.bet_id, vote: results[i]}})
        bettings = await bot.Bettings.findAll({where: { bet_id: bet.dataValues.bet_id, vote: results[i]}})
        bettings.forEach(betting => {
          total += parseInt(betting.dataValues.value)
        })

        if(bet.dataValues.result_type != "GROUP"){
          bet_embed.addFields({
            name: results[i].toString(),
            value: `${value} - Ratio if win : ${parseFloat(ratios[i]).toFixed(2)} | Votes : ${nb} | Total : ${total}pts`
          })
        } else {
          bet_embed.addFields({
            name: results[i].toString(),
            value: `${value}`
          })
        }
      }
    }

    if (bet.dataValues.result_type == "PLAYER") {

      results = bet.dataValues.results.split(",")
      choices = bet.dataValues.choices.split(",")
      ratios = bet.dataValues.ratios.split(",")

      // console.log(ratios)

      last_player = await bot.Players.findOne({where: { player_id: choices[0]}})
      res = ""
      total = 0

      for(choice of choices){

        player = await bot.Players.findOne({where: { player_id: choice}})

        if(last_player.dataValues.player_team != player.dataValues.player_team){
          last_team = await bot.Teams.findOne({where: { team_id: last_player.dataValues.player_team}})
          bet_embed.addFields({
            name: last_team.dataValues.team_name,
            value: res
          })
          res = ""
        }

        name = "<@"+choice+">"

        vote = await bot.Bettings.count({where: { bet_id: bet.dataValues.bet_id, vote: results[choices.indexOf(choice)]}})
        bettings = await bot.Bettings.findAll({where: { bet_id: bet.dataValues.bet_id, vote: results[choices.indexOf(choice)]}})
        bettings.forEach(betting => {
          total += parseInt(betting.dataValues.value)
        })
        res += `**${results[choices.indexOf(choice)]}** : ${name} - Ratio : ${parseFloat(ratios[choices.indexOf(choice)]).toFixed(2)} | Votes : ${vote} | Total : ${total}pts\n`
        last_player = await bot.Players.findOne({where: { player_id: choice}})
        total = 0
      }
      last_team = await bot.Teams.findOne({where: { team_id: last_player.dataValues.player_team}})
      bet_embed.addFields({
        name: last_team.dataValues.team_name,
        value: res
      })
    }

    if (bet.dataValues.result_type == "GROUP") {
      bet_embed.setDescription("Possible value :")
      bet.dataValues.choices.split(",").forEach((c, i) => { bet_embed.addFields({ name: (i+1).toString(), value: `<@${c}>`})})
    }

    if(bet.dataValues.score) bet_embed.addFields({ name: 'Score', value: `(not mandatory to bet)`})

    if(bet.dataValues.status == "OPEN") bet_embed.addFields({ name: '\u200B', value: `Votes close at <t:${bet.dataValues.close_date}:t> (<t:${bet.dataValues.close_date}:R>) | BET ID : \`${bet.dataValues.bet_id}\`.`})
    else if (bet.dataValues.status == "CLOSED") bet_embed.addFields({ name: '\u200B', value: `Votes are now closed | BET ID : \`${bet.dataValues.bet_id}\`.`})
    else if (bet.dataValues.status == "ENDED") bet_embed.addFields({ name: '\u200B', value: `This bet has already ended, final result is : **${bet.dataValues.final}** | BET ID : \`${bet.dataValues.bet_id}\`.`})

    let bet_row = new Discord.ActionRowBuilder().addComponents(
       new Discord.ButtonBuilder()
        .setCustomId(`${bet.dataValues.bet_id}_vote`)
        .setLabel("BET")
        .setStyle(Discord.ButtonStyle.Primary))

    if(!update) return await bot.channels.cache.get(post).send({embeds: [bet_embed], components: [bet_row]})
    else if(bet.dataValues.status == "CLOSED") return await bot.channels.cache.get(bet.dataValues.channel).messages.fetch(bet.dataValues.message).then(message => {message.edit({embeds: [bet_embed], components: []})})
    else return await bot.channels.cache.get(bet.dataValues.channel).messages.fetch(bet.dataValues.message).then(message => {message.edit({embeds: [bet_embed]})})
  }

}
