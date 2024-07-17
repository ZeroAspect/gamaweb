const express = require("express")
const app = require("./config/config.js")
const sequelize = require("sequelize")
const db = require("./databases/sequelize.js")
// const { create } = require("express-handlebars")
const path = require("path")
const getIpGeolocation = require("./getUser/ip.js")
const MySQLConnection = require("./databases/mysql2.js")
const User = require("./models/GetSequelizeUsers.js")
const { marked } = require("marked")
const Post = require("./models/GetSequelizePosts.js")
const hbs = require("express-handlebars")
const Comentarios = require("./models/GetSequelizeComments.js")
// Set up handlebars view engine

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.engine("handlebars", hbs.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname + '/views'))

app.get('/', async(req, res)=>{
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const userInfo = await User.findOne({
      where: { ip: ip['ip'] }
    })
    const dataUser = {
      nome: userInfo['nome']
    }
    const [ posts ] = await query.query(`
      SELECT * FROM posts ORDER BY id DESC
    `)
    res.render('home', { nome: userInfo['nome'], dataUser, posts })
  }
})

app.get('/cadastro', async(req, res)=>{
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.render('cadastro')
  } else {
    res.redirect('/')
  }
})

app.post('/cadastro', async(req, res)=>{
  const { nome, email, senha } = req.body
  const formatNome = nome.toLowerCase()
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    console.log(req.body)
    const newUser = await User.create({
      nome: formatNome.replace(' ', ''),
      email: email,
      senha: senha,
      biografia: "",
      ip: ip['ip']
    })
    console.log(newUser)
    res.redirect('/')
  } else {
    res.redirect('/cadastro')
  }
})

app.get('/login', async(req, res)=>{
  // const query = await MySQLConnection()
  // const ip = await getIpGeolocation()
  // console.log(ip['ip'])
  // const user = await User.findOne({
  //   where: { ip: ip['ip'] }
  // })
  // if(user === null){
  //   res.render('login')
  // } else {
  //   res.redirect('/')
  // }
  res.render("login")
})

app.post('/login', async(req, res)=>{
  const { email, senha } = req.body
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { email: email, senha: senha }
  })
  if(user === null){
    const validation = `
      <div class="alert alert-danger" rule="alert">
        <h4 class="alert-heading">Erro fatal</h4>
        <p>
          Email ou senha inválidos! <br>
          Tente inserir dados invalidos.
        </p>
        <hr>
        <p class="mb-0">Por favor, tente novamente. Ou crie uma conta clicando <a href="/cadastro">Aqui</a>.</p>
      </div>
    `
    res.render('login', { validation })
  } else {
    const [ update ] = await query.query(`
      UPDATE
      users
      SET
      ip = '${ip['ip']}'
      WHERE
      email = '${email}' and senha = '${senha}'
      `)
    console.log(update)
    res.redirect('/')
  }
})
app.post('/publicar', async(req, res)=>{
  const { titulo, content } = req.body
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  const createPost = await Post.create({
    nome: user['nome'],
    titulo: titulo,
    conteudo: marked(content),
    data: Date()
  })
  console.log(createPost)
  res.redirect('/')
})
app.get('/post/:id', async(req, res)=>{
  const { id } = req.params
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const [ post ] = await query.query(`
      SELECT * FROM posts WHERE id = ${id}
    `)
    const [ comments ] = await query.query(`
      SELECT * 
      FROM comentarios
      WHERE post_id = ${id}
      `)
    res.render('post', { nome: user['nome'], post, comments: comments })
    // res.json(post)
  }
})
app.post('/post/:id/publicar/comentario', async(req, res)=>{
  const { id } = req.params
  const { comentario } = req.body
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    // const createComment = await Post.update({
    //   conteudo: `${post['conteudo']}<br><br>Comentário de ${user['nome']}: ${comentario}`
    // }, {
    //   where: { id: id }
    // })
    // console.log(createComment)
    // res.redirect(`/post/${id}`)
    const createComment = await Comentarios.create({
      post_id: id,
      nome: user['nome'],
      comentario: comentario,
      data: Date()
    })
    console.log(createComment)
    res.redirect(`/post/${id}`)
  }
})
app.post("/post/:id/like", async(req, res)=>{
  const { id } = req.params
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const post = await MySQLConnection()
    const [ update ] = await post.query(`
      UPDATE
      posts
      SET
      curtidas = curtidas + 1
      WHERE
      id = ${id}
      `)
    console.log(update)
    res.redirect(`/post/${id}`)
  }
})
app.get('/:nome', async(req, res)=>{
  const { nome } = req.params
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const [ info ] = await query.query(`
      SELECT * FROM users WHERE nome = '${nome}'
    `)
    res.render('perfil', { nome: user['nome'], info })
  }
})
app.get("/editar/perfil", async(req, res)=>{
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const [ info ] = await query.query(`
      SELECT * FROM users WHERE nome = '${user['nome']}'
    `)
    res.render('editar_perfil', { nome: user['nome'], info })
  }
})
app.post("/editar/perfil", async(req, res)=>{
  const { nome, senha, email, biografia } = req.body
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const [ update ] = await query.query(`
      UPDATE users
      SET 
      nome = '${nome}',
      email = '${email}',
      senha = '${senha}',
      biografia = '${marked(biografia)}'
      WHERE
      ip = '${ip['ip']}'
      `)
    console.log(update)
    res.redirect(`/${user['nome']}`)
  }
})
app.get('/:nome/publicacoes', async(req, res)=>{
  const { nome } = req.params
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const [ posts ] = await query.query(`
      SELECT * FROM posts WHERE nome = '${nome}' ORDER BY data DESC
    `)
    res.render('publicacoes', { nome: user['nome'], posts })
  }
})
app.get('/:nome/comentarios', async(req, res)=>{
  const { nome } = req.params
  const query = await MySQLConnection()
  const ip = await getIpGeolocation()
  console.log(ip['ip'])
  const user = await User.findOne({
    where: { ip: ip['ip'] }
  })
  if(user === null){
    res.redirect('/login')
  } else {
    const [ comments ] = await query.query(`
      SELECT * FROM comentarios WHERE nome = '${nome}' ORDER BY id DESC
    `)
    res.render('comentarios', { nome: user['nome'], comments })
  }
})