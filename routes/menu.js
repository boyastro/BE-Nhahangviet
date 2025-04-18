const express = require('express')
const router = express.Router()
const MenuItem = require('../models/MenuItem')

// GET all
router.get('/', async (req, res) => {
  const items = await MenuItem.find()
  res.json(items)
})

// POST new
router.post('/', async (req, res) => {
  const newItem = new MenuItem(req.body)
  await newItem.save()
  res.json(newItem)
})

// PUT update
router.put('/:id', async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updated)
})

module.exports = router
