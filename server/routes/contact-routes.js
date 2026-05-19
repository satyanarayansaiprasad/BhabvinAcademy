const express = require("express");
const { submitContactForm } = require("../controllers/contact-controller");

const router = express.Router();

router.post("/submit", submitContactForm);

module.exports = router;
