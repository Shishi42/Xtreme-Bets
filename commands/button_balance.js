const Discord = require("discord.js")

module.exports = {

  name: "button_balance",
  description: "Create the balance checking system message",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Admin",

  async run(bot, message, args) {

    message.deferReply({ephemeral: true})
    message.deleteReply()

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
    .setTitle(`Click the button to check your balance`)
    .setTimestamp()
    .setFooter({text: `executed by ${message.user.username}`, iconURL: `${message.user.displayAvatarURL()}`})

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('balance')
        .setLabel('Enter')
        .setStyle(Discord.ButtonStyle.Primary))

    message.channel.send({embeds: [embed], components: [row]})

  }
}
