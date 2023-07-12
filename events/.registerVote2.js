const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    await interaction.deferReply({ephemeral: true})

    voteInput = interaction.fields.getTextInputValue('voteInput');
	  balanceInput = interaction.fields.getTextInputValue('balanceInput');

    bet_id = interaction.customId.split("_")[2]

    member = await bot.Members.findOne({ where: { member_id: interaction.member.id }})
    bet = await bot.Bets.findOne({ where: { bet_id: bet_id }})
    // if(bet.dataValues.score) scoreInput = interaction.fields.getTextInputValue('scoreInput')
    betting_id = await bot.Bettings.count() + 1

    err = ""

    if(parseInt(balanceInput) <= 0 || parseInt(balanceInput) > parseInt(member.dataValues.balance)) err += "You do not have enough points.\n"

    if(bet.dataValues.result_type == "MATCH" || bet.dataValues.result_type == "FIXTURE" || bet.dataValues.result_type == "PLAYER" || bet.dataValues.result_type == "TEAM"){
      if(!bet.dataValues.results.split(",").includes(voteInput)) err += "Your vote is not valid.\n"
      // if(bet.dataValues.score && scoreInput && !(/^([0-9]+-[0-9]+)$/.test(scoreInput))) err += "Your score is not valid.\n"
    }

    if(err != "") return interaction.editReply(err)

    new_balance = parseInt(member.dataValues.balance) - parseInt(balanceInput)

    bot.Bettings.create({betting_id: betting_id, bet_id: bet_id, member_id: interaction.member.id, vote: voteInput, score: "", value: balanceInput})
    bot.Members.update({ balance: new_balance}, { where: { member_id: interaction.member.id }})

    require(`../events/.updateRatio.js`).run(bot, bet)

    // if(scoreInput) return interaction.editReply(`Your bet on **${bet.dataValues.label}** has been succesfully registered with the vote **${voteInput}** and score **${scoreInput}** , using points **${balanceInput}**pts.`)
    // else return 
    interaction.editReply(`Your bet on **${bet.dataValues.label}** has been succesfully registered with the vote **${voteInput}**, using points **${balanceInput}**pts.`)
  }

}
