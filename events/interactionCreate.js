const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

  if(interaction.guild.id == bot.wc) return

  if(interaction.type === Discord.InteractionType.ApplicationCommand) require(`../commands/${interaction.commandName}`).run(bot, interaction, interaction.options)
  else if (interaction.isButton() && interaction.customId === 'enter') require(`../events/.enterGame.js`).run(bot, interaction)
  else if (interaction.isButton() && interaction.customId === 'balance') require(`../commands/balance.js`).run(bot, interaction, interaction.options)
  else if (interaction.isButton() && interaction.customId.includes('vote')) require(`../events/.registerVote1.js`).run(bot, interaction)
  else if (interaction.isModalSubmit() && interaction.customId.startsWith("bet_modal")) require(`../events/.registerVote2.js`).run(bot, interaction)
}
