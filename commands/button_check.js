const Discord = require("discord.js")

module.exports = {

  name: "button_check",
  description: "Create the balance checking system message",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Admin",

  async run(bot, message, args) {

    message.deferReply({ephemeral: true})
    message.deleteReply()

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Xtreme Bets', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC'})
    .setThumbnail(bot.guilds.cache.get(bot.wc).iconURL())
    .setTitle(`Click the button to check all your active bets.`)
    .setTimestamp()
    .setFooter({text: `A IESXWC bot`, iconURL: bot.guilds.cache.get(bot.wc).iconURL()})

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('check')
        .setLabel('Check')
        .setStyle(Discord.ButtonStyle.Primary))

    message.channel.send({embeds: [embed], components: [row]})

  }
}
