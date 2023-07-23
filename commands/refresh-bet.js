const Discord = require("discord.js")

module.exports = {

  name: "refresh-bet",
  description: "Refresh the display of a bet",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Bet",
  options: [
    {
      type: "string",
      name: "id",
      description: "Id of the bet to refresh or status",
      required: true,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ephemeral: true})

    id = args.get("id").value

    if(id.toUpperCase() == "ALL" || id.toUpperCase() == "OPEN" || id.toUpperCase() == "CLOSED" || id.toUpperCase() == "ENDED"){
      if(id.toUpperCase() == "ALL") bets = await bot.Bets.findAll()
      else bets = await bot.Bets.findAll({ where: { status: id.toUpperCase()}})

      for(bet of bets){
        await require(`../events/.postEmbed.js`).run(bot, bet, null, true)
      }
      require(`../events/.log.js`).run(bot, `[REFRESH-BET-STATUS] : **${message.member.user.username}** of **${id.toUpperCase()}**`)

    } else {
      let bet = await bot.Bets.findOne({ where: { bet_id: id }})
      if(!bet) return message.editReply("No bet with this ID.")
      require(`../events/.postEmbed.js`).run(bot, bet, null, true)
      require(`../events/.log.js`).run(bot, `[REFRESH-BET] : **${message.member.user.username}** of id **${id}**`)
    }
    return message.editReply({content: `Done.`, ephemeral: true})
  }
}
