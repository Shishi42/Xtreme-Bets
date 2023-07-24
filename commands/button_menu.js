const Discord = require("discord.js")

module.exports = {

  name: "button_menu",
  description: "Create the menu system message",
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
    .setTitle('Xtreme Bets Buttons Menu')
    .addFields(
      {name: "Enter the game", value: "Click **Enter** to get your first 100 points."},
      {name: "Checking your current balance", value: "Click **Check Balance** to check your balance."},
      {name: "Checking your bets history", value: "Click **Check History** to check all your bets."})
    .setTimestamp()
    .setFooter({text: `A IESXWC bot`, iconURL: bot.guilds.cache.get(bot.wc).iconURL()})

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('enter')
        .setLabel('Enter')
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId('balance')
        .setLabel('Check Balance')
        .setStyle(Discord.ButtonStyle.Primary),
      new Discord.ButtonBuilder()
        .setCustomId('check')
        .setLabel('Check History')
        .setStyle(Discord.ButtonStyle.Primary)
    )

    message.channel.send({embeds: [embed], components: [row]})

  }
}
