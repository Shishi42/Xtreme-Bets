const Discord = require("discord.js")

module.exports = {

  name: "check_user_balance",
  description: "Check user balance",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",
  options: [
    {
      type: "user",
      name: "user",
      description: "User to check balance",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    user = args.get("user")
    let member = await bot.Members.findOne({ where: { member_id: user.user.id }})

    if(member === null) message.reply({content: `${user.user.tag} has 0 points.`, ephemeral: true})
    else message.reply({content: `${user.user.tag} has ${member.balance} points.`, ephemeral: true})
    await require(`../events/.log.js`).run(bot, `[CHECK-BALANCE] : **${message.member.user.username}** for **${user.user.username}'s'** balance : **${member.balance}**`)
  }
}
