const slashcommands_loader = require("../loaders/slashcommands_loader")
const Sequelize = require("sequelize")

module.exports = async bot => {

  await slashcommands_loader(bot)

  bot.db = new Sequelize({
    dialect: 'sqlite',
    storage: './bet.db'
  })

  bot.Matches = bot.db.define('match', {
  	match_id: {
  		type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
  	},
  	team_1: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    team_2: {
      type: Sequelize.TEXT,
      allowNull: false,
    }
  })

  bot.Bets = bot.db.define('bet', {
    bet_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    member: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    id_match: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    vote: {
      type: Sequelize.STRING,
      allowNull: false,
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
    role_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    flag: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    captain: {
      type: Sequelize.STRING,
      unique: true,
    },
    member_2: {
      type: Sequelize.STRING,
      unique: true,
    },
    member_3: {
      type: Sequelize.STRING,
      unique: true,
    },
    member_4: {
      type: Sequelize.STRING,
      unique: true,
    }
  })

  bot.Matches.sync()
  bot.Bets.sync()
  bot.Members.sync()
  bot.Teams.sync()

  console.log(`Database online`)

  console.log(`Connecté en tant que ${bot.user.tag}!`)

  bot.user.setPresence({activities: [{ name: "Inazuma Eleven Strikers 2013 Xtreme", type: 1 }], status: 'online'})

}
