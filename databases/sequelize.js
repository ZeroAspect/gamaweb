const sequelize = require("sequelize")

const db = new sequelize.Sequelize("mysql://root:eQjHLQQRomALxmVwlCdEWJKIIxEARWwV@viaduct.proxy.rlwy.net:45330/railway", {
  dialect: "mysql",
  host: "viaduct.proxy.rlwy.net",
  port: 45330,
  username: "root",
  password: "eQjHLQQRomALxmVwlCdEWJKIIxEARWwV",
  database: "railway"
})

module.exports = db