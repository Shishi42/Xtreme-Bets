const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

  if(interaction.guild.id == bot.wc) return

  if(interaction.type === Discord.InteractionType.ApplicationCommand) {
       let command = require(`../commands/${interaction.commandName}`)
       command.run(bot, interaction, interaction.options)

  } else if (interaction.isButton() && interaction.customId === 'enter') {
    let member = await bot.Members.findOne({ where: { member_id: interaction.member.id }})
    if(member == null){
      await bot.Members.create({member_id: interaction.member.id})
      interaction.reply({content: 'You have been granted 100 points.', ephemeral: true})
    } else {
      interaction.reply({content: 'You have already been granted your starting points.', ephemeral: true})
    }

  } else if (interaction.isButton() && interaction.customId === 'balance') {
    let command = require(`../commands/balance.js`)
    command.run(bot, interaction, interaction.options)
  }
}
