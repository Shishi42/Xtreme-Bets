const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  async run(bot, bet, post, update = false) {

    bet_embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
      .setTitle(bet.dataValues.label)
      .setDescription("Possible vote :")
      .setImage(bet.dataValues.image_url)
      .setTimestamp()
      .setFooter({text: `A IESXWC bot`, iconURL: bot.guilds.cache.get(bot.wc).iconURL()})

    if (bet.dataValues.result_type == "MATCH" || bet.dataValues.result_type == "FIXTURE") {

      results = bet.dataValues.results.split(",")
      ratios = bet.dataValues.ratios.split(",")
      total = 0

      for(i = 0; i < results.length; i++){

        value = (bet.dataValues.choices.split(",")[i] == "DRAW") ? "DRAW" : "<@"+bet.dataValues.choices.split(",")[i]+">"
        nb = await bot.Bettings.count({where: { bet_id: bet.dataValues.bet_id, vote: results[i]}})
        bettings = await bot.Bettings.findAll({where: { bet_id: bet.dataValues.bet_id, vote: results[i]}})
        bettings.forEach(betting => {
          total += parseInt(betting.dataValues.value)
        })

        bet_embed.addFields({
          name: results[i],
          value: `${value} - Win Ratio : ${parseInt(ratios[i]).toFixed(2)} | Votes : ${nb} | Total : ${total}pts`
        })
      }

      if(bet.dataValues.status == "OPEN") bet_embed.addFields({ name: '\u200B', value: `Votes close at <t:${bet.dataValues.close_date}:t> (<t:${bet.dataValues.close_date}:R>).`})
      else if (bet.dataValues.status == "CLOSED") bet_embed.addFields({ name: '\u200B', value: `Votes are now closed.`})
      else if (bet.dataValues.status == "ENDED") bet_embed.addFields({ name: '\u200B', value: `This bet has already ended. Result : ${bet.dataValues.final}`})
    }
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
