const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    await interaction.deferReply({ephemeral: true})

    voteInput = interaction.fields.getTextInputValue('voteInput');
	  balanceInput = interaction.fields.getTextInputValue('balanceInput');

    bet_id = interaction.customId.split("_")[2]

    member = await bot.Members.findOne({ where: { member_id: interaction.member.id }})
    bet = await bot.Bets.findOne({ where: { bet_id: bet_id }})
    betting_id = await bot.Bettings.count() + 1

    err = ""

    if(parseInt(balanceInput) <= 0 || parseInt(balanceInput) > parseInt(member.dataValues.balance)) err += "You do not have enough points.\n"

    if(bet.dataValues.result_type == "MATCH" || bet.dataValues.result_type == "FIXTURE"){
      if(bet.dataValues.draw && (voteInput != "1" && voteInput != "2" && voteInput != "N")) err += "Your vote is not valid1.\n"
      else if(!bet.dataValues.draw && (voteInput != "1" && voteInput != "2")) err += "Your vote is not valid2.\n"
    }

    if(err != "") return interaction.editReply(err)

    new_balance = parseInt(member.dataValues.balance) - parseInt(balanceInput)

    bot.Bettings.create({betting_id: betting_id, bet_id: bet_id, member_id: interaction.member.id, vote: voteInput, value: balanceInput})
    bot.Members.update({ balance: new_balance}, { where: { member_id: interaction.member.id }})

    require(`../events/.updateRatio.js`).run(bot, bet)

    return interaction.editReply(`Your bet on ${bet.dataValues.label} has been succesfully registered with vote : ${voteInput} | points : ${balanceInput}`)
  }

}
