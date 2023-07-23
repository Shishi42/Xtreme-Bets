const Discord = require("discord.js")

module.exports = {

  name: "button_info",
  description: "Create the info system message",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Admin",

  async run(bot, message, args) {

    message.deferReply({ephemeral: true})
    message.deleteReply()

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setThumbnail(bot.user.displayAvatarURL())
    .setTitle(`Xtreme Bets Presentation Menu`)
    .setDescription(`Here is a presention on what is Xtreme Bets.`)
    .setTimestamp()
    .setFooter({text: `A IESXWC bot`, iconURL: bot.guilds.cache.get(bot.wc).iconURL()})
    .addFields(
      {name: "Welcome to Xtreme Bets", value: "The goal of this game running along-side the IESXWC is to be able to bet on the World Cup fixtures/matches/MVP/etc..\nAt the end of the WC will be released a leaderboard of the members with the biggest ~~wallet~~ brain :moneybag::brain:"},
      {name: "How to start ?", value: "You can find below a message with a button, click it and you will get your first 100 points :arrow_down:"},
      {name: "How to bet ?", value: "Go to https://discord.com/channels/1002554730863661147/1047857979879346177 and find a bet that you want to bet on, click the **BET** button and fill your bet info."},
      {name: "How to fill the bet info ?", value: "When submitting a bet you will be asked 2 things : \n- The amount of points that you put into play. \n- What you bet on (usually a number that represents a choice displayed on the bet message)."},
      {name: "How much time I have to bet ?", value: "Usually the bets will be available a few days before the event and will be automatically closed at the beginning of said events."},
      {name: "How do I check my balance and active bets ?", value: "You can find below some messages with a button that you can use for these purposes."},
      {name: "How can I know that I won or lost a bet ?", value: "When a bet has ended you will receive via DM the result of your bet so **please check that the bot can send it to you.**"},
      {name: "I have no more points, can I get some free ?", value: "**No**, losing all your points means that you are **eliminated**, so be careful when you bet."},
      {name: "I made a mistake, can I cancel my bet ?", value: "**No**, submitted bets are **final**, be **really** careful when you bet."},
      {name: "Note", value: "The only purpose of this system is to add even more fun to the World Cup so please refrain from toxic behaviors regarding this **non-serious** game.\nWith all that said, good luck everyone :soccer::zap:"},
      {name: "Contact", value: "If you need any help please contact me on Discord/Twitter. (@shishi4272)"},
    )

    message.channel.send({embeds: [embed]})


  }
}
