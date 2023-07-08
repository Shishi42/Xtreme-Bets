const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    await interaction.deferReply({ephemeral: true})

    let title = interaction.fields.getTextInputValue('titleInput')
    let choice = interaction.fields.getTextInputValue('choiceInput')

    if (choice == "TEAM") {
      results = await bot.Teams.findAll()
      text_result = "Possible results :\n\n"+results.map(result => result.dataValues.team_alias).join("\n")
    }

    else if (choice.startsWith("GROUP")) {
      results = await bot.Teams.findAll({where: {team_group: choice.split("_")[1]}})
      text_result = "Possible results :\n\n"+results.map(result => result.dataValues.team_alias).join("\n")
    }

    if (choice == "PLAYER") {
      results = await bot.Players.findAll()
      text_result = "Possible results :\n\n"+results.map(result => result.dataValues.player_alias).join("\n")
    }

    if(choice == "CUSTOM") text_result = "Custom"

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
    .setThumbnail(bot.guilds.cache.get(bot.wc).iconURL())
    .setTitle(title)
    .setDescription(text_result)
    .setTimestamp()
    .setFooter({text: `executed by ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})

    const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(Discord.ButtonStyle.Danger)
    )
    const collector = interaction.channel.createMessageComponentCollector({time: 30000, max: 1})
    interaction.editReply({embeds: [embed], components: [row]})

    collector.on('collect', async i => {
      await i.deferUpdate()
      if(i.customId === 'confirm') {

        return i.editReply({content: 'Bet created', ephemeral: true})

      } else if (i.customId === 'cancel') {
        return i.editReply({content: 'Bet creation canceled', ephemeral: true})
      }
    })
  }
}
