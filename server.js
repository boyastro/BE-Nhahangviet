// server.js
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

app.use('/api', authRoutes)
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/menus', require('./routes/menuRoutes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
