const mysql = require("mysql2")

// Database connection
async function MySQLConnection(){
  const connection = await mysql.createPool({
    uri: "mysql://root:eQjHLQQRomALxmVwlCdEWJKIIxEARWwV@viaduct.proxy.rlwy.net:45330/railway"
  })

  const pool = connection.promise()

  return pool
}

module.exports = MySQLConnection