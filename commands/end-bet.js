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
    // {
    //   type: "string",
    //   name: "score",
    //   description: "Score result of the bet",
    //   required: false,
    //   autocomplete: false,
    // },
  ],

  async run(bot, message, args) {

    if(!await bot.Bets.findOne({ where: { bet_id: args.get("id").value }})) return message.editReply("No bet with this ID.")

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
        bot.users.cache.get(betting.dataValues.member_id).send(`You earned **${new_points}pts**, with the bet : **${bet.dataValues.label}**.`)
      } catch (error) {
        console.error(error)
      }
    }

    bettings = await bot.Bettings.findAll({ where: { bet_id: args.get("id").value, vote: {[Op.ne]: args.get("result").value}}})
    for(betting of bettings){
      try {
        bot.users.cache.get(betting.dataValues.member_id).send(`Unfortunately you lost the bet : **${bet.dataValues.label}** (${betting.dataValues.value}pts).`)
      } catch (error) {
        await require(`../events/.log.js`).run(bot, `[ERROR-DM] : **${bot.users.cache.get(betting.dataValues.member_id).username}**`)
      }
    }

    // if(bet.dataValues.score){
    //   bettings = await bot.Bettings.findAll({ where: { bet_id: args.get("id").value, vote: args.get("result").value, score: args.get("score").value}})
    //   for(betting of bettings){
    //     member = await bot.Members.findOne({ where: { member_id: betting.dataValues.member_id }})
    //     new_balance = parseInt(parseInt(betting.dataValues.value) * parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(args.get("result").value)]) + parseInt(member.dataValues.balance))
    //     bot.Members.update({ balance: new_balance}, { where: { member_id: betting.dataValues.member_id }})
    //   }
    //
    //   bettings = await bot.Bettings.findAll({ where: { bet_id: args.get("id").value, vote: args.get("result").value, score: ""}})
    //   for(betting of bettings){
    //     member = await bot.Members.findOne({ where: { member_id: betting.dataValues.member_id }})
    //     new_balance = parseInt(parseInt(betting.dataValues.value) * parseFloat(bet.dataValues.ratios.split(",")[bet.dataValues.results.split(",").indexOf(args.get("result").value)]) + parseInt(member.dataValues.balance))
    //     bot.Members.update({ balance: new_balance}, { where: { member_id: betting.dataValues.member_id }})
    //   }
    // }
    //
    // else {

    // }
    require(`../events/.log.js`).run(bot, `[END-BET] : **${bet.dataValues.label}** with id : **${bet.dataValues.bet_id}** with final result : **${args.get("result").value}**`)
    return message.reply({content: `Done.`, ephemeral: true})
  }
}
