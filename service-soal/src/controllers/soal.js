const downloadFile = require("../util/docxExtractorFromTemplate")
const shuffle = require("shuffle-array")

exports.acakSoal = async (req, res, next) => {
    try{
        const email = req.body.email
        const docxURL = req.body.docxURL
        const jumlahAcakan = req.body.totalAcak
        const defaultSoal = await downloadFile.extractDocxFromURL(docxURL)
        const finalResult = []
        for (let i = 0; i < jumlahAcakan; i++) {
            const shuffleResult = shuffle(defaultSoal).map(value => {
                value.pilihan = shuffle(value.pilihan)
                return value
            })
            console.log(shuffleResult)
            finalResult.push(shuffleResult)
        }
        res.json({
         finalResult
        })
    }catch (e) {
        next(e)
    }
}
