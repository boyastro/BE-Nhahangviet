const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the contact form schema
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  subject: {
    type: String,
    required: [true, "Please enter a subject"],
  },
  message: {
    type: String,
    required: [true, "Please write a message"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
