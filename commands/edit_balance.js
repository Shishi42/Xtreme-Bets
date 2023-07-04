const Discord = require("discord.js")

module.exports = {

  name: "edit_balance",
  description: "Edit user balance",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",
  options: [
    {
      type: "user",
      name: "user",
      description: "User to edit balance",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "amount",
      description: "Amount to edit, usage : {+|-}{number}",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    user = args.get("user")
    amount = args.get("amount").value.substring(1)
    pol = args.get("amount").value.substring(0, 1)

    if((pol != "+" && pol != "-") || (isNaN(amount))) message.reply({content: `Amount is not valid, usage : {+|-}{number}, exemple : +100 or -50`, ephemeral: true})

    let member = await bot.Members.findOne({ where: { member_id: user.user.id }})

    if(member == null) message.reply({content: `User has not entered the bet system`, ephemeral: true})

    else {
      member_balance = parseInt(member.balance)
      if(pol == "+") member_balance += parseInt(amount)
      else if(pol == "-") member_balance -= parseInt(amount)
      if(member_balance < 0) member_balance = 0

      await bot.Members.update({ balance: member_balance}, { where: { member_id: user.user.id }})
      message.reply({content: `${user.user.tag} new balance is ${member_balance}`, ephemeral: true})
    }
  }
}
