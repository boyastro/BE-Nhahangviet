const express = require('express')
const router = express.Router()
const MenuItem = require('../models/MenuItem')

// ==================== GET all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách món' })
  }
})

// ==================== POST new menu item
router.post('/', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body)
    await newItem.save()
    res.json(newItem)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi thêm món mới' })
  }
})

// ==================== PUT update a menu item
router.put('/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật món' })
  }
})

// ==================== DELETE a menu item
router.delete('/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id)
    res.json({ message: 'Món ăn đã được xoá thành công' })
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xoá món' })
  }
})

module.exports = router
