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

    if()

  //   await message.deferReply({ephemeral: true})
  //
  //   let embed = new Discord.EmbedBuilder()
  //   .setColor(bot.color)
  //   .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
  //   .setTitle(`New Match`)
  //   .setDescription(`${args.get("team1")} VS ${args.get("team2")}`)
  //   .setTimestamp()
  //   .setFooter({text: `executed by ${message.user.username}`, iconURL: `${message.user.displayAvatarURL()}`})
  //
  //   const row = new Discord.ActionRowBuilder()
  //   .addComponents(
  //     new Discord.ButtonBuilder()
  //       .setCustomId("confirm_ban")
  //       .setLabel("Confirm")
  //       .setStyle(Discord.ButtonStyle.Success),
  //     new Discord.ButtonBuilder()
  //       .setCustomId("cancel_ban")
  //       .setLabel("Cancel")
  //       .setStyle(Discord.ButtonStyle.Danger)
  //   )
  //   const collector = message.channel.createMessageComponentCollector({time: 60000, max: 1})
  //
  //   message.editReply({embeds: [embed], components: [row], ephemeral: true})
  //
  //   collector.on('collect', async i => {
  //     await i.deferUpdate()
  //     if(i.customId === 'confirm_ban') {
  //       message.editReply({components: []})
  //
  //       bet_id = ""
  //
  //       return await i.editReply("Bet registered.")
  //
  //     } else if (i.customId === 'cancel_ban') {
  //       message.editReply({components: []})
  //       return await i.editReply("Bet canceled.")
  //     }
  //   })
  }
}
