const sequelize = require("sequelize")
const db = require("../databases/sequelize.js")

const Comentarios = db.define("comentarios", {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  post_id: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  nome: {
    type: sequelize.TEXT,
    allowNull: false
  },
  comentario: {
    type: sequelize.TEXT,
    allowNull: false
  },
  data: {
    type: sequelize.DATE,
    allowNull: false
  }
})

module.exports = Comentarios