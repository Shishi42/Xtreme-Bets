const Discord = require("discord.js")

module.exports = {

  async run(bot) {

    // require(`../events/.log.js`).run(bot, `[LAUNCH-DELETE-EVENT-AUTO]`)

    bot.channels.cache.get(bot.announcement).messages.fetch().then(messages => messages.forEach(message => {
      // id = message.content.split("/")[5]
      id = message.content.split("event=")[1]
      bot.guilds.cache.get(bot.wc).scheduledEvents.fetch(id).then(event => {
        if(event.isCompleted()){
          message.delete()
          require(`../events/.log.js`).run(bot, `[DELETE-EVENT] : **${id}**`)
        }
      })
    }))
  }
}
