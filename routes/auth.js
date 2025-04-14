const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===== Signup =====
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'Tên đăng nhập đã tồn tại' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: 'Tạo tài khoản thành công' });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server' });
    }
});

// ===== Login =====
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Sai tên đăng nhập hoặc mật khẩu' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Sai tên đăng nhập hoặc mật khẩu' });

        // Optional: tạo token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ msg: 'Đăng nhập thành công', token });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server' });
    }
});

module.exports = router;
