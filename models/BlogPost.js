// models/BlogPost.js
const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    tags: [String],
    image: String,
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
