const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

  // if(interaction.guild.id == bot.wc) return

  if(interaction.type === Discord.InteractionType.ApplicationCommand) require(`../commands/${interaction.commandName}`).run(bot, interaction, interaction.options)
  else if (interaction.isButton() && interaction.customId === 'enter') require(`../custom_events/enterGame.js`).run(bot, interaction)
  else if (interaction.isButton() && interaction.customId === 'balance') require(`../commands/balance.js`).run(bot, interaction, interaction.options)
  else if (interaction.customId === 'bet_modal') require(`../custom_events/addBet.js`).run(bot, interaction)

}
