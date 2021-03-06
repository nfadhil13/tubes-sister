const {validationResult} = require("express-validator")
const path = require("path")
const fs = require("fs")
const MessageBroker = require("../util/rabbitmq/MessageBroker")

exports.generateTemplate = async (req, res, next) => {
    try{
        const validatonResult = validationResult(req)
        console.log(`Sampai disini ${validatonResult}`)
        if (!validatonResult.isEmpty()) {
            const error = new Error('Invalid Input')
            error.statusCode = 400
            error.cause = validatonResult.errors[0].msg
            throw error
        }
        const email  = req.body.email
        const totalSoal = req.body.totalSoal
        const totalPilihan = req.body.totalPilihan
        const totalPaket = req.body.paket
        res.json({
            message: `template akan dikirim ke ${email}`
        })
        const broker = await MessageBroker.getInstance()
        await broker.sendMessage("soalserivce/generate-template", Buffer.from(JSON.stringify({
            email,
            totalSoal,
            totalPilihan,
            totalPaket
        })))
    }catch (e) {
        next(e)
    }
}

exports.acakSoal = async (req, res, next) => {
    let filePath=null;
    try{
        if (req.file) {
            filePath = req.file.path.replace(/\\/gi, "/");
        }else{
            const error = new Error('Invalid Input')
            error.statusCode = 422
            error.cause = "File docx belum anda kirim"
            throw error
        }
        const validatonResult = validationResult(req)
        if (!validatonResult.isEmpty()) {
            const error = new Error('Invalid Input')
            error.statusCode = 422
            error.cause = validatonResult.errors[0].msg
            throw error
        }
        const email  = req.body.email
        const jumlahAcak = req.body.jumlahAcak
        res.json({
            message: `hasil acak soal akan dikirim ke ${email}`
        })
        const  publicFileURL = `https://service-frontend.nfadhil.me/docx/${req.file.filename}`
        const broker = await MessageBroker.getInstance()
        await broker.sendMessage("soalservice/acakSoal", Buffer.from(JSON.stringify({
            email,
            jumlahAcak,
            urlFile: publicFileURL
        })))
        console.log("Berhasil mengirim message")
    }catch (e) {
        if(filePath!=null){
            deleteImage(filePath)
        }
        next(e)
    }
}



const deleteImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
