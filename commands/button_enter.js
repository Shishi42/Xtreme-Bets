const Discord = require("discord.js")

module.exports = {

  name: "button_enter",
  description: "Create the enter betting system message",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Admin",

  async run(bot, message, args) {

    message.deferReply({ephemeral: true})
    message.deleteReply()

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC'})
    .setThumbnail(bot.guilds.cache.get(bot.wc).iconURL())
    .setTitle(`Click the button to get your first points`)
    .setDescription(`As a starting point you will receive 100 points.`)
    .setTimestamp()
    .setFooter({text: `executed by ${message.user.username}`, iconURL: `${message.user.displayAvatarURL()}`})

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('enter')
        .setLabel('Enter')
        .setStyle(Discord.ButtonStyle.Primary))

    message.channel.send({embeds: [embed], components: [row]})

  }
}
