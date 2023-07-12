const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    bet_id = interaction.customId.split("_")[0]
    member = await bot.Members.findOne({ where: { member_id: interaction.member.id }})
    bet = await bot.Bets.findOne({ where: { bet_id: bet_id }})

    if(bet.dataValues.status != "OPEN") return interaction.reply({content: 'This bet is already closed or ended.', ephemeral: true})
    if(!member) return interaction.reply({content: 'Please enter the game first in order to get your starting points.', ephemeral: true})
    if(await bot.Bettings.findOne({ where: { member_id: interaction.member.id, bet_id: bet_id}})) return interaction.reply({content: 'You have already voted for that bet.', ephemeral: true})

    const modal = new Discord.ModalBuilder()
      .setCustomId("bet_modal_"+bet_id)
			.setTitle(`Bet Registration - Your Balance : ${member.dataValues.balance}`)

    placeholder = bet.dataValues.results.split(",").length > 3 ?
      bet.dataValues.results.split(",")[0]+" or "+bet.dataValues.results.split(",")[1]+"..."+bet.dataValues.results.split(",")[bet.dataValues.results.split(",").length-1] :
      bet.dataValues.results.split(",").join(" or ")

  	const voteInput = new Discord.TextInputBuilder()
			.setCustomId('voteInput')
			.setLabel("Please state your bet.")
      .setPlaceholder(placeholder)
			.setStyle(Discord.TextInputStyle.Short)
    modal.addComponents(new Discord.ActionRowBuilder().addComponents(voteInput))

    // if(bet.dataValues.score){
    //   const scoreInput = new Discord.TextInputBuilder()
  	// 		.setCustomId('scoreInput')
  	// 		.setLabel("What is the final score (exemple : 3-1) ?")
    //     .setPlaceholder("LEAVE EMPTY IF YOU DONT WANT TO BET ON SCORE")
  	// 		.setStyle(Discord.TextInputStyle.Short)
    //     .setRequired(false)
    //   modal.addComponents(new Discord.ActionRowBuilder().addComponents(scoreInput))
    // }

		const balanceInput = new Discord.TextInputBuilder()
			.setCustomId('balanceInput')
			.setLabel("How much do you want to bet ?")
    	.setValue("10")
		  .setStyle(Discord.TextInputStyle.Short)
    modal.addComponents(new Discord.ActionRowBuilder().addComponents(balanceInput))

		await interaction.showModal(modal)
  }

}
