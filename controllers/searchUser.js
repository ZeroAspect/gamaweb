const MySQLConnection = require("../databases/mysql2.js");

async function getAllUsers() {
  const pool = await MySQLConnection();
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

async function getOneUser({ username }){
  const pool = await MySQLConnection();
  const [rows] = await pool.query("SELECT * FROM users WHERE username =?", [username]);
  return rows;
}

async function createUser({ username, email, password, biografia, ip }){
  const pool = await MySQLConnection()
  try{
    await pool.query("INSERT INTO users (nome, email, senha, biografia, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)", [username, email, password, biografia, ip, '', ''])
    return {
      success: true,
      message: "Usuário criado com sucesso!"
    }
  } catch {
    return {
      success: false,
      message: "Houve um erro ao tentar cadastrar o usuário."
    }
  }
}

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
}