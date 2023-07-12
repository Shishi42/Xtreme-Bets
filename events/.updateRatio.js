const Discord = require("discord.js")

module.exports = {

  async run(bot, bet) {

    let bettings = await bot.Bettings.findAll({ where: { bet_id: bet.dataValues.bet_id }})

    results = bet.dataValues.results.split(",")
    ratio = {}
    sums = {}
    total = 0
    res = []

    bettings.forEach(betting => {
      if(!sums[betting.dataValues.vote]) sums[betting.dataValues.vote] = 0
      sums[betting.dataValues.vote] += parseInt(betting.dataValues.value)
      total += parseInt(betting.dataValues.value)
    })

    Object.keys(sums).forEach(sum => {ratio[sum] = total / sums[sum]})

    results.forEach(result => {
      ratio[result] ? res.push(ratio[result]) : res.push(1.00)
    })

    await bot.Bets.update({ ratios: res.toString()}, { where: { bet_id: bet_id }})
    bet = await bot.Bets.findOne({ where: { bet_id: bet_id }})

    await require(`../events/.postEmbed.js`).run(bot, bet, null, true)
  }
}
