const express = require('express')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
dotenv.config()

const auth = function (req, res, next) {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ message: 'NO token, not authorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ message: 'invalid token' })
  }
}

app.use(express.json())

const db = mongoose.createConnection(process.env.DB_URL)

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
})

const userModel = db.model('user', userSchema)
const SALT = Number(process.env.SALT)

app.post('/signup', async function (req, res) {
  const { userName, email, password } = req.body
  const existingUser = await userModel.findOne({ userName: userName })
  const existingEmail = await userModel.findOne({ email: email })
  if (!existingUser && !existingEmail) {
    const hashedPassword = bcrypt.hashSync(password, SALT)
    const newUser = new userModel({
      userName: userName,
      email: email,
      password: hashedPassword,
    })
    const xyz = await newUser.save()
    try {
      const payload = {
        user: {
          id: xyz._id,
        },
      }
      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: 86400 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (error) {
      res.status(400).send({
        error: `invalid`,
      })
    }
  } else {
    res.status(400).send({
      error: 'user exists',
    })
  }
})

app.post('/login', async function (req, res) {
  const { userName, password } = req.body
  const existingUser = await userModel.findOne({
    userName: userName,
  })

  let arePasswordSame = false
  if (existingUser) {
    arePasswordSame = bcrypt.compareSync(password, existingUser.password)
  }
  if (!existingUser || !arePasswordSame) {
    res.status(401).send({ error: 'username/password incorrect' })
  } else {
    try {
      const payload = {
        user: {
          id: existingUser._id,
        },
      }
      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (error) {
      res.status(400).send({
        error: `invalid`,
      })
    }
  }
})

app.get('/user', auth, async function (req, res) {
  console.log('user id', req.user)
  const userInfo = await userModel
    .findOne({ _id: req.user.id })
    .select('-password')
  if (userInfo) {
    res.status(200).send(userInfo)
  } else {
    res.status(404).send('user not found')
  }
})

app.post('/logout', async function (req, res) {
  res.status(200).send('you are logged out')
})

app.listen(process.env.PORT, () => {
  console.log('server running on ', process.env.PORT)
})
