const express = require("express")
const soalController = require("../controllers/soal")

const router = express.Router()

router.post("/acak", soalController.acakSoal)

module.exports = router
