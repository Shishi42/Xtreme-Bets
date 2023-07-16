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
    res = "__["+temp_date.getHours().toString().padStart(2,"0")+":"+temp_date.getMinutes().toString().padStart(2,"0")+":"+temp_date.getSeconds().toString().padStart(2,"0")+" - "+temp_date.getDate().toString().padStart(2,"0")+" "+months[temp_date.getMonth()]+" "+temp_date.getFullYear()+"]__ - " + message
    bot.channels.cache.get(bot.log).send(res)
  }

}
