const Discord = require("discord.js")

module.exports = {

  name: "list-bet",
  description: "List the bets",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",
  options: [
    {
      type: "string",
      name: "status",
      description: "Status of the bet to list. (OPEN, CLOSED, ENDED)",
      required: false,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    await message.reply({content: "Searching..", ephemeral: true})

    if(args.get("status")) bets = await bot.Bets.findAll({ where: { status: args.get("status").value }})
    else bets = await bot.Bets.findAll()

    for(bet of bets){
      bet_embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
        .setTitle(bet.dataValues.label)
        .setImage(bet.dataValues.image_url)
        .setTimestamp()
        .setFooter({text: `A IESXWC bot`, iconURL: bot.guilds.cache.get(bot.wc).iconURL()})

      bet_embed.addFields({ name: 'Result type', value: `${bet.dataValues.result_type}`})
      bet_embed.addFields({ name: 'Possible results', value: `${bet.dataValues.results}`})
      // bet_embed.addFields({ name: 'Choices', value: `${bet.dataValues.choices}`})
      // bet_embed.addFields({ name: 'Ratios', value: `${bet.dataValues.ratios}`})
      bet_embed.addFields({ name: 'Message posted', value: `https://discord.com/channels/${bot.channels.cache.get(bet.dataValues.channel).guild.id}/${bet.dataValues.channel}/${bet.dataValues.message}`})
      if(bet.dataValues.status == "OPEN") bet_embed.addFields({ name: '\u200B', value: `Votes close at <t:${bet.dataValues.close_date}:t> (<t:${bet.dataValues.close_date}:R>). BET ID : \`${bet.dataValues.bet_id}\`.`})
      else if (bet.dataValues.status == "CLOSED") bet_embed.addFields({ name: '\u200B', value: `Votes are now closed. BET ID : \`${bet.dataValues.bet_id}\`.`})
      else if (bet.dataValues.status == "ENDED") bet_embed.addFields({ name: '\u200B', value: `This bet has already ended. Result : ${bet.dataValues.final}. BET ID : \`${bet.dataValues.bet_id}\`.`})

      message.followUp({embeds: [bet_embed], ephemeral: true})
    }
    await require(`../events/.log.js`).run(bot, `[LIST-BET] : **${message.member.user.username}** with status **${args.get("status")}**`)
    return message.editReply({content: `Done.`, ephemeral: true})
  }
}
