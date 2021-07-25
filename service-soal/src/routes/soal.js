const express = require("express");
const soalController = require("../controllers/soal");

const Router = express.Router();

Router.post("/generate-template", soalController.generateTemplate);

module.exports = Router;
