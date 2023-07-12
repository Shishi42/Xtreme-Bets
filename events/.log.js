const Discord = require("discord.js")

module.exports = {

  async run(bot, message) {

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]

    temp_date = new Date()
    res = "__["+temp_date.getHours()+":"+temp_date.getMinutes()+":"+temp_date.getSeconds()+" - "+temp_date.getDate()+" "+months[temp_date.getMonth()]+" "+temp_date.getFullYear()+"]__ - " + message
    bot.channels.cache.get(bot.log).send(res)
  }

}
