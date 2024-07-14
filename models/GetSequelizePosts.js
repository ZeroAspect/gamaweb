const sequelize = require("sequelize")
const db = require("../databases/sequelize.js")

const Post = db.define("posts", {
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
  titulo: {
    type: sequelize.TEXT,
    allowNull: false
  },
  conteudo: {
    type: sequelize.TEXT,
    allowNull: false
  },
  data: {
    type: sequelize.DATE,
    allowNull: false
  }
})

module.exports = Post