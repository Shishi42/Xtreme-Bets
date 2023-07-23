const Discord = require("discord.js")

module.exports = {

  name: "balance",
  description: "Check your balance",
  permission: null,
  dm: true,
  category: "Utility",

  async run(bot, message, args) {

    let member = await bot.Members.findOne({ where: { member_id: message.member.id }})

    if(!member) {
      message.reply({content: `You have 0 points.`, ephemeral: true})
      require(`../events/.log.js`).run(bot, `[BALANCE] : **${message.member.user.username}** : **0**`)
    }
    else {
      message.reply({content: `You have ${member.dataValues.balance} points.`, ephemeral: true})
      require(`../events/.log.js`).run(bot, `[BALANCE] : **${message.member.user.username}** : **${member.dataValues.balance}**`)
    }
  }
}
