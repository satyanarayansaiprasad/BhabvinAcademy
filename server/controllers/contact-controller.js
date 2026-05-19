const Contact = require("../models/Contact");

const submitContactForm = async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    if (!name || !email || !category || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newContact = new Contact({
      name,
      email,
      category,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the form.",
    });
  }
};

module.exports = { submitContactForm };
