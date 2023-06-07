const Discord = require("discord.js")

module.exports = {

  name: "add-bet",
  description: "Add a bet to the pool",
  permission: null,
  dm: true,
  category: "Bet system",
  options: [
    {
      type: "string",
      name: "exemple",
      description: "description de l'option",
      required: false,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {
    message.reply("Exemple")
  }
}
