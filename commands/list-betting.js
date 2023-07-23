const Discord = require("discord.js")

module.exports = {

  name: "list-betting",
  description: "List the bettings",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",
  options: [
    {
      type: "string",
      name: "id",
      description: "Id of the bet to show all bettings",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    await message.reply({content: "Searching..", ephemeral: true})

    bet = await bot.Bets.findOne({ where: { bet_id: args.get("id").value}})
    if(!bet) message.editReply({content: "No bet with this ID.", ephemeral: true})

    for(betting of await bot.Bettings.findAll({ where: { bet_id: args.get("id").value}})){
      message.followUp({content: `**${bot.users.cache.get(betting.dataValues.member_id).username}** on **${bet.dataValues.label}** (**${bet.dataValues.bet_id}**) with **${betting.dataValues.vote}** using **${betting.dataValues.value}pts**`, ephemeral: true})
    }

    require(`../events/.log.js`).run(bot, `[LIST-BETTING] : **${message.member.user.username}** with id **${args.get("id").value}**`)
    return message.editReply({content: `Done.`, ephemeral: true})
  }
}
