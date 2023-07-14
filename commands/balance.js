const Discord = require("discord.js")

module.exports = {

  name: "balance",
  description: "Check your balance",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Balance",

  async run(bot, message, args) {

    let member = await bot.Members.findOne({ where: { member_id: message.member.id }})

    if(!member) {
      message.reply({content: `You have 0 points.`, ephemeral: true})
      await require(`../events/.log.js`).run(bot, `[BALANCE] : **${message.member.user.username}** : **${member.dataValues.balance}**`)
    }
    else {
      message.reply({content: `You have ${member.balance} points.`, ephemeral: true})
      await require(`../events/.log.js`).run(bot, `[BALANCE] : **${message.member.user.username}** : **0**`)
    }
  }
}
