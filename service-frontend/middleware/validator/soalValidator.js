const { body } = require("express-validator")

const generateTemplateValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email tidak boleh kosong")
            .isEmail().withMessage("Format email tidak valid"),
        body("totalSoal")
            .notEmpty().withMessage("Total Soal tidak boleh kosong")
            .isInt().withMessage("Format total soal adalah angka")
            .custom((value) => {
                if(value > 50){
                    throw new Error("Maksimal jumlah soal adalah 50");
                }else if(value < 1){
                    throw new Error("Minimal jumlah soal adalah 1")
                }
                return true
            }),
        body("totalPilihan")
            .trim()
            .notEmpty().withMessage("Total pilihan tidak boleh kosong")
            .isInt().withMessage("Format total soal adalah angka")
            .custom((value) => {
                if(value > 5){
                    throw new Error("Maksimal pilihan soal adalah 5.");
                }else if(value < 2){
                    throw new Error("Minimal Pilihan adalah 2")
                }
                return true
            }),
        body("paket")
            .trim()
            .notEmpty().withMessage("Total paket tidak boleh kosong")
            .isInt().withMessage("Format paket soal adalah angka")
            .custom((value) => {
                if(value > 2){
                    throw new Error("Maksimal paket adalah 2.");
                }else if(value < 1){
                    throw new Error("Minimal paket adalah 1")
                }
                return true
            })
    ]
}

const acakSoalValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email tidak boleh kosong")
            .isEmail().withMessage("Format email tidak valid"),
        body("jumlahAcak")
            .notEmpty().withMessage("Jumlah acak tidak boleh kosong")
            .isInt().withMessage("Jumlah acak soal adalah angka")
            .custom((value) => {
                if(value > 5){
                    throw new Error("Maksimal Jumlah acak adalah 5");
                }else if(value < 1){
                    throw new Error("Minimal Jumlah acak adalah 1")
                }
                return true
            })
        ]
}

module.exports = {
    generateTemplateValidator,
    acakSoalValidator
}
