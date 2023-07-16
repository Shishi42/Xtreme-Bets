const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    let member = await bot.Members.findOne({ where: { member_id: interaction.member.id }})
    if(member == null){
      await bot.Members.create({member_id: interaction.member.id})
      interaction.reply({content: 'You have been granted 100 points.', ephemeral: true})
      await require(`../events/.log.js`).run(bot, `[GAME-ENTER] : **${interaction.member.user.username}**`)
    } else {
      interaction.reply({content: 'You have already been granted your starting points.', ephemeral: true})
      await require(`../events/.log.js`).run(bot, `[GAME-ENTER-ERROR] : **${interaction.member.user.username}**`)
    }
  }

}
