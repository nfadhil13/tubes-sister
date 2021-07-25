const express = require("express");
const emailController = require("../controllers/emailController");

const router = express.Router();

router.post("/send-template", emailController.sendUrlTemplateSoal);

module.exports = router;
