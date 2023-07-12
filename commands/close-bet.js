const Discord = require("discord.js")

module.exports = {

  name: "close-bet",
  description: "Close a bet",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Bet",
  options: [
    {
      type: "string",
      name: "id",
      description: "Id of the bet to close",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    if(message){
      if(!await bot.Bets.findOne({ where: { bet_id: args.get("id").value }})) return message.editReply("No bet with this ID.")
      id = args.get("id").value
      await bot.Bets.update({ status: "CLOSED" }, { where: { bet_id: id }})
      bet = await bot.Bets.findOne({ where: { bet_id: id }})
      require(`../events/.postEmbed.js`).run(bot, bet, null, true)
    } else {
      let epoch = Math.round(new Date().getTime() / 1000)
      open_bets = await bot.Bets.findAll({ where: { status: "OPEN" }})
      for(bet of open_bets){
        bot.Bets.update({ status: "CLOSED" }, { where: { bet_id: bet.dataValues.bet_id }})
        bet_update = await bot.Bets.findOne({ where: { bet_id: bet.dataValues.bet_id }})
        require(`../events/.postEmbed.js`).run(bot, bet_update, null, true)
      }
    }
    await require(`../events/.log.js`).run(bot, `[CLOSE-BET] : **${bet.dataValues.label}** with id : **${bet.dataValues.bet_id}**`)
    return message.reply({content: `Done.`, ephemeral: true})
  }
}
