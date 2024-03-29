const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  name: "add-bet",
  description: "Add a bet to the pool",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Bet",
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
      name: "group",
      description: "In case of group selection",
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

    bet_id = parseInt(await bot.Bets.count()) + 1

    let title = args.get("title").value
    let choice = args.get("type").value
    let draw = args.get("draw") ? true : false
    let image = args.get("image") ? args.get("image").value : null
    let votes = []

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Xtreme Bets', iconURL: bot.user.displayAvatarURL(), url: 'https://twitter.com/IESXWC' })
    .setTitle(title)
    .setDescription("Possible results :")
    .setImage(image)
    .setTimestamp()
    .setFooter({text: `executed by ${message.user.username}`, iconURL: `${message.user.displayAvatarURL()}`})

    count = 0

    if (choice == "MATCH" || choice == "FIXTURE") {

      if(choice == "MATCH"){
        choice1 = args.get("user1").value
        choice2 = args.get("user2").value
        id = ""
        if(!await bot.Players.findOne({ where: { player_id: choice1 }}) || await !bot.Players.findOne({ where: { player_id: choice2 }})) return message.editReply("One of the user provided is not a player.")
      } else {
        choice1 = args.get("team1").value
        choice2 = args.get("team2").value
        id = "&"
        if(!await bot.Teams.findOne({ where: { team_id: choice1 }}) || await !bot.Teams.findOne({ where: { team_id: choice2 }})) return message.editReply("One of the role provided is not a team.")
      }

      choices = draw ? [id+choice1,"DRAW",id+choice2] : [id+choice1,id+choice2]

    } if (choice == "PLAYER" || choice == "MVP") {
      if(choice == "PLAYER") teams = await bot.Teams.findAll()
      else if(choice == "MVP") teams = [await bot.Teams.findOne({ where: { team_id: args.get("team1").value }}),  await bot.Teams.findOne({ where: { team_id: args.get("team2").value }})]
      players = []
      for(team of teams){
        players.push(await bot.Players.findAll({ where: { player_team: team.dataValues.team_id }}))
      }
      choices = players.flat().map(player => player.dataValues.player_id)

    } if (choice == "GROUP") {

      teams = await bot.Teams.findAll({ where: { team_group: args.get("group").value }})
      choices = teams.map(team => "&"+team.dataValues.team_id)

      choices.forEach((c, i) => { embed.addFields({ name: (i+1).toString(), value: `<@${c}>`})})

      votes = [
        "1-2-3-4",
        "1-2-4-3",
        "1-3-2-4",
        "1-3-4-2",
        "1-4-2-3",
        "1-4-3-2",
        "2-1-3-4",
        "2-1-4-3",
        "2-3-1-4",
        "2-3-4-1",
        "2-4-1-3",
        "2-4-3-1",
        "3-1-2-4",
        "3-1-4-2",
        "3-2-1-4",
        "3-2-4-1",
        "3-4-1-2",
        "3-4-2-1",
        "4-1-2-3",
        "4-1-3-2",
        "4-2-1-3",
        "4-2-3-1",
        "4-3-1-2",
        "4-3-2-1",
      ]

    } if (choice == "TEAM") {
      teams = await bot.Teams.findAll()
      choices = teams.map(team => "&"+team.dataValues.team_id)
    }

    if(choice != "GROUP"){
      choices.forEach(c => {
        vote = (c == "DRAW") ? "N" : ++count
        if(choice != "PLAYER") embed.addFields({ name: vote.toString(), value: (c == "DRAW") ? c : `<@${c}>`})
        votes.push(vote)
      })
    }

    if(choice == "PLAYER") embed.addFields({ name: choices.length.toString(), value: "ALL PLAYERS"})

    embed.addFields({ name: '\u200B', value: `Votes close at <t:${args.get("epoch").value}:f> (<t:${args.get("epoch").value}:R>).`})

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

        if(choice == "FIXTURE"){
          desc = title+"\n\n\n\n- **SPANISH STREAM 🇪🇸**\n - https://www.twitch.tv/tecaotaku\n - https://www.twitch.tv/adrisylver23\n - https://www.twitch.tv/punchodd\n\n- **FRENCH STREAM 🇫🇷**\n - https://www.twitch.tv/phase5_\n\n- **GERMAN STREAM 🇩🇪** \n - https://www.twitch.tv/nd_haku\n\n- **ITALIAN STREAM 🇮🇹**\n - https://www.twitch.tv/ninokiii\n\n- **BRAZILIAN STREAM 🇧🇷**\n - https://www.twitch.tv/lemonadeeventosbr\n\n- **ENGLISH STREAM 🇬🇧**\n - https://www.youtube.com/@TaleOfTheToaster\n\n- **POLISH STREAM 🇵🇱**\n - https://www.youtube.com/@igoxteam8935\n"
          time = parseInt(args.get("epoch").value+"000")

          event = await message.guild.scheduledEvents.create({
            name: title,
            scheduledStartTime: new Date(time),
            scheduledEndTime: new Date(time+5400000),
            privacyLevel: 2,
            entityType: 3,
            image: image ? image : null,
            description: desc,
            entityMetadata: {location: "https://twitter.com/IESXWC"},
          })
          bot.channels.cache.get(bot.announcement).send(event.url)
        }

        post = await require(`../events/.postEmbed.js`).run(bot, bet, args.get("post").value)
        bot.Bets.update({ message: post.id}, { where: { bet_id: bet_id }})

        require(`../events/.log.js`).run(bot, `[ADD-BET] : **${message.member.user.username}** added **${title}** with id : **${bet_id}**`)
        return i.editReply({content: `Bet **${title}** created with id : **${bet_id}**.`, components: [], ephemeral: true})

      } else if (i.customId === 'cancel') {
        require(`../events/.log.js`).run(bot, `[ADD-BET] : **${message.member.user.username}** tried to add **${title}** with id : **${bet_id}**`)
        return i.editReply({content: 'Bet creation canceled.', components: [], ephemeral: true})
      }
    })
  }
}
