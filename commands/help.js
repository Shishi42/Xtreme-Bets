const Discord = require("discord.js")

module.exports = {

  name: "help",
  description: "Show help menu",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utility",
  options: [
    {
      type: "string",
      name: "command",
      description: "Command to show",
      required: false,
      autocomplete: true,
    }
  ],

  async run(bot, message, args) {

    let command
    if(args.get("command")){
      command = bot.commands.get(args.get("command").value)
      if(!command) return message.reply("No command with this name")
    }

    if(!command){

      let categories = []
      bot.commands.forEach(command => {
        if(!categories.includes(command.category)) categories.push(command.category)
      })

      let embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setTitle("Bot Commands")
      .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
      .setDescription(`Available Commands: \`${bot.commands.size}\` \nAvailable Categories : \`${categories.length}\``)
      .setFooter({text: 'a Strikers World Cup 2023 Official Bot', iconURL: 'https://pbs.twimg.com/profile_images/1662212462110810115/M0CLudSr_400x400.jpg'})
      .setTimestamp()

      await categories.sort().forEach(async cat => {
        let commands = bot.commands.filter(cmd => cmd.category === cat)
        embed.addFields({name: `${cat}`, value: `${commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}`})
      })

      await message.reply({embeds: [embed]})

    } else {

      let embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setTitle(`Command **${command.name}**`)
      .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
      .setDescription(`Name : \`${command.name}\` \nDescription : \`${command.description}\` \nRequired Permission : \`${typeof command.permission !== "bigint" ? command.permission !== null ? command.permission : "None" : new Discord.PermissionsBitField(command.permission).toArray(false)}\` \nCommand in DM : \`${command.dm ? "Yes" : "No"}\` \nCategory : \`${command.category}\``)
      .setTimestamp()
      .setFooter({text: 'a Strikers World Cup 2023 Official Bot', iconURL: 'https://pbs.twimg.com/profile_images/1662212462110810115/M0CLudSr_400x400.jpg'})

      await message.reply({embeds: [embed]})
    }
  }
}
