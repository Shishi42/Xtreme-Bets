const Discord = require("discord.js")
const { Op } = require("sequelize")

module.exports = {

  name: "end-bet",
  description: "End a bet",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Bet",
  options: [
    {
      type: "string",
      name: "id",
      description: "Id of the bet to end",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "result",
      description: "Result of the bet",
      required: true,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    bet = await bot.Bets.findOne({ where: { bet_id: args.get("id").value }})

    if(!bet) return message.reply({content: "No bet with this ID.", ephemeral: true})
    if(bet.dataValues.status == "ENDED") return message.reply({content: "This bet has already ended.", ephemeral: true})

    await bot.Bets.update({ status: "ENDED", final: args.get("result").value}, { where: { bet_id: args.get("id").value }})
    bet = await bot.Bets.findOne({ where: { bet_id: args.get("id").value }})
    require(`../events/.postEmbed.js`).run(bot, bet, null, true)

    bettings = await bot.Bettings.findAll({ where: { bet_id: args.get("id").value, vote: args.get("result").value }})
    for(betting of bettings){
      member = await bot.Members.findOne({ where: { member_id: betting.dataValues.member_id }})
      new_points = parseInt(parseInt(betting.dataValues.value) * parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(args.get("result").value)]))
      new_balance = new_points + parseInt(member.dataValues.balance)
      bot.Members.update({ balance: new_balance}, { where: { member_id: betting.dataValues.member_id }})
      try {
        bot.users.cache.get(betting.dataValues.member_id).send(`**Congrats !** You earned **${new_points}pts** (${betting.dataValues.value}pts x ${parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(args.get("result").value)]).toFixed(2).toString()}), with the bet : **${bet.dataValues.label}** while voting : **${betting.dataValues.vote}**.`)
        require(`../events/.log.js`).run(bot, `[WIN-BET] : **${bot.users.cache.get(betting.dataValues.member_id).username}** on **${bet.dataValues.label}** (${bet.dataValues.bet_id}) with **${betting.dataValues.vote}** using **${betting.dataValues.value}pts** :arrow_right: winning **${new_points}pts** (${betting.dataValues.value}pts x ${parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(args.get("result").value)]).toFixed(2).toString()})`)
      } catch (error) {
        require(`../events/.log.js`).run(bot, `[ERROR-DM] : **${bot.users.cache.get(betting.dataValues.member_id).username}**`)
      }
    }

    bettings = await bot.Bettings.findAll({ where: { bet_id: args.get("id").value, vote: {[Op.ne]: args.get("result").value}}})
    for(betting of bettings){
      try {
        bot.users.cache.get(betting.dataValues.member_id).send(`Unfortunately you **lost** the bet : **${bet.dataValues.label}** using ${betting.dataValues.value}pts while voting : **${betting.dataValues.vote}**.`)
        require(`../events/.log.js`).run(bot, `[LOST-BET] : **${bot.users.cache.get(betting.dataValues.member_id).username}** on **${bet.dataValues.label}** (${bet.dataValues.bet_id}) with **${betting.dataValues.vote}** using **${betting.dataValues.value}pts**`)
      } catch (error) {
        require(`../events/.log.js`).run(bot, `[ERROR-DM] : **${bot.users.cache.get(betting.dataValues.member_id).username}**`)
      }
    }

    require(`../events/.log.js`).run(bot, `[END-BET] : **${bet.dataValues.label}** with id : **${bet.dataValues.bet_id}** with final result : **${args.get("result").value}**`)
    return message.reply({content: `Done.`, ephemeral: true})
  }
}
