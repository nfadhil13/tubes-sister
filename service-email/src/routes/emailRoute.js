const express = require("express");
const emailController = require("../controllers/emailController");

const router = express.Router();

router.post("/send-url-file", emailController.sendUrlFile);

module.exports = router;
