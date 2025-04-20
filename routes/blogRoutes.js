// routes/BlogRoutes.js
const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");

// ==============================
// Create new blog
// Tạo mới bài viết
router.post("/", async (req, res) => {
  try {
    const { title, content, image, category } = req.body;

    const newPost = new BlogPost({
      title,
      content,
      image,
      category,
      author: "admin", // hoặc lấy từ req.user nếu có auth
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Lỗi khi thêm blog:", err);
    res.status(500).json({ error: "Lỗi server khi thêm blog" });
  }
});

// ==============================
// Get all blogs
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// Get blog by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// Update blog by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// Delete blog by ID
router.delete("/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa bài viết" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
