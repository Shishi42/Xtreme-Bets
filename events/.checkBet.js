const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    await interaction.reply({content: "Searching..", ephemeral: true})

    bettings = await bot.Bettings.findAll({ where: { member_id: interaction.member.id }})
    if(bettings.length == 0) await interaction.editReply({content: "You have no active bets.", ephemeral: true})
    else {
      for(betting of bettings){
        bet = await bot.Bets.findOne({ where: { bet_id: betting.dataValues.bet_id }})
        res = `You have betted on ${bet.dataValues.label} with ${betting.dataValues.vote} using ${betting.dataValues.value}pts.`
        interaction.followUp({content: res, ephemeral: true})
      }
      await interaction.editReply({content: "Done.", ephemeral: true})
    }
    require(`../events/.log.js`).run(bot, `[BET-CHECK] : **${interaction.member.user.username}**`)
  }
}
