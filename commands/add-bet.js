const Discord = require("discord.js")

module.exports = {

  name: "add-bet",
  description: "Add a bet to the pool",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",

  async run(bot, message, args) {

    const modal = new Discord.ModalBuilder()
      .setCustomId("bet_modal")
			.setTitle("Bet Creation")

		const titleInput = new Discord.TextInputBuilder()
			.setCustomId('titleInput')
			.setLabel("What is the bet title ?")
			.setStyle(Discord.TextInputStyle.Short)

		const choiceInput = new Discord.TextInputBuilder()
			.setCustomId('choiceInput')
			.setLabel("What is the type of result ?")
		  .setStyle(Discord.TextInputStyle.Short)

		const firstActionRow = new Discord.ActionRowBuilder().addComponents(titleInput)
		const secondActionRow = new Discord.ActionRowBuilder().addComponents(choiceInput)

		modal.addComponents(firstActionRow, secondActionRow);
		await message.showModal(modal)
  }
}
