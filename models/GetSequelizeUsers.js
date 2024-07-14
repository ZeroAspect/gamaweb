const sequelize = require("sequelize")
const db = require("../databases/sequelize.js")

const User = db.define("users", {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: sequelize.TEXT,
    allowNull: false,
  },
  senha: {
    type: sequelize.TEXT,
    allowNull: false,
  },
  biografia: {
    type: sequelize.TEXT,
    allowNull: true
  },
  ip: {
    type: sequelize.TEXT,
    allowNull: true
  }
})

module.exports = User