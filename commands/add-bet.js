const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  name: "add-bet",
  description: "Add a bet to the pool",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Admin",
  options: [
    {
      type: "string",
      name: "title",
      description: "What is the bet title ?",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "type",
      description: "What is the type of result ?",
      required: true,
      autocomplete: false,
    },
    {
      type: "channel",
      name: "post",
      description: "Channel to post the bet",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "epoch",
      description: "Date the votes close",
      required: true,
      autocomplete: false,
    },
    {
      type: "role",
      name: "team1",
      description: "In case of fixture : Team 1",
      required: false,
      autocomplete: false,
    },
    {
      type: "role",
      name: "team2",
      description: "In case of fixture : Team 2",
      required: false,
      autocomplete: false,
    },
    {
      type: "user",
      name: "user1",
      description: "In case of match : User 1",
      required: false,
      autocomplete: false,
    },
    {
      type: "user",
      name: "user2",
      description: "In case of match : User 2",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "image",
      description: "Image URL to display",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "draw",
      description: "Draw is possible or not",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ephemeral: true})

    bet_id = await bot.Bets.count() + 1

    let title = args.get("title").value
    let choice = args.get("type").value
    let draw = args.get("draw") ? true : false
    let image = args.get("image") ? args.get("image").value : null
    let votes = []

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Inazuma BET', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
    .setTitle(title)
    .setDescription("Possible results :")
    .setImage(image)
    .setTimestamp()
    .setFooter({text: `executed by ${message.user.username}`, iconURL: `${message.user.displayAvatarURL()}`})

    if (choice == "MATCH" || choice == "FIXTURE") {

      if(choice == "MATCH"){
        choice1 = args.get("user1").value
        choice2 = args.get("user2").value
        id = ""
        // if(!await bot.Players.findOne({ where: { player_id: user1 }}) || await !bot.Players.findOne({ where: { player_id: user2 }})) return message.editReply("One of the user provided is not a player.")
      } else {
        choice1 = args.get("team1").value
        choice2 = args.get("team2").value
        id = "&"
        // if(!await bot.Teams.findOne({ where: { team_id: team1 }}) || await !bot.Players.findOne({ where: { team_id: team2 }})) return message.editReply("One of the role provided is not a tealm.")
      }

      choices = draw ? [id+choice1,"DRAW",id+choice2] : [id+choice1,id+choice2]

    }

    count = 0
    choices.forEach(choice => {
      vote = (choice == "DRAW") ? "N" : ++count
      embed.addFields({ name: vote.toString(), value: (choice == "DRAW") ? choice : `<@${choice}>`})
      votes.push(vote)
    })

    embed.addFields({ name: '\u200B', value: `Votes close at <t:${args.get("epoch").value}:t> (<t:${args.get("epoch").value}:R>).`})

    const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(Discord.ButtonStyle.Danger)
    )
    const collector = message.channel.createMessageComponentCollector({time: 30000, max: 1})
    message.editReply({embeds: [embed], components: [row]})

    collector.on('collect', async i => {
      await i.deferUpdate()
      if(i.customId === 'confirm') {

        ratios = new Array(votes.length).fill((1).toFixed(2))
        bet = await bot.Bets.create({
          bet_id: bet_id,
          result_type: choice,
          results: votes.toString(),
          choices: choices.toString(),
          ratios: ratios.toString(),
          label: title,
          draw: draw,
          channel: args.get("post").value,
          message: "",
          close_date: args.get("epoch").value,
          image_url: image,
        })

        post = await require(`../events/.postEmbed.js`).run(bot, bet, args.get("post").value)
        bot.Bets.update({ message: post.id}, { where: { bet_id: bet_id }})

        // message.editReply({components: []})
        //
        // return i.followUp(`Bet **${title}** created with id : **${bet_id}**.`)
        return i.editReply({content: `Bet **${title}** created with id : **${bet_id}**.`, components: [], ephemeral: true})

      } else if (i.customId === 'cancel') {
        return i.editReply({content: 'Bet creation canceled.', components: [], ephemeral: true})
      }
    })
  }
}
