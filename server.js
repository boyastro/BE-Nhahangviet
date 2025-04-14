const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Kết nối MongoDB thành công');
        app.listen(5000, () => console.log('Server chạy tại http://localhost:5000'));
    })
    .catch(err => console.log(err));
