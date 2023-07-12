const slashcommands_loader = require("../loaders/slashcommands_loader")
const Sequelize = require("sequelize")

module.exports = async bot => {

  await slashcommands_loader(bot)

  bot.db = new Sequelize({
    dialect: 'sqlite',
    storage: './bet.db'
  })

  bot.Bets = bot.db.define('bet', {
    bet_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    result_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    results: {
      type: Sequelize.STRING,
    },
    final: {
      type: Sequelize.STRING,
    },
    choices: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ratios: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    result_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    draw: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    score: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "OPEN",
    },
    channel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    close_date: {
      type: Sequelize.STRING,
    },
    image_url: {
      type: Sequelize.STRING,
    },
  })

  bot.Bettings = bot.db.define('betting', {
    betting_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    bet_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    member_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    vote: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    score: {
      type: Sequelize.STRING,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  })

  bot.Members = bot.db.define('member', {
    member_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    balance: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "100",
    }
  })

  bot.Teams = bot.db.define('team', {
    team_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    team_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    team_alias: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    team_group: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
  })

  bot.Players = bot.db.define('player', {
    player_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    player_alias: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    player_team: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_captain: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })

  bot.Bets.sync()
  bot.Bettings.sync()
  bot.Members.sync()
  bot.Teams.sync()
  bot.Players.sync()

  console.log(`Database online`)

  console.log(`Connecté en tant que ${bot.user.tag}!`)

  bot.user.setPresence({activities: [{ name: "Inazuma Eleven Strikers 2013 Xtreme", type: 1 }], status: 'online'})

}
