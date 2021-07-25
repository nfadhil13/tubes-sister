import axios from "axios";
import errorHandler from "./errorHandler";

const generateTemplate = async (email, totalSoal, totalPilihan) => {
    try{
        await axios.post("https://service-frontend.nfadhil.me/generate-soal",{
            email,
            totalSoal,
            totalPilihan,
            paket:1
        })
        return true
    }catch (e) {
        return await errorHandler.errorHandler(e)
    }
}

const acakSoal = async (data) => {
    try{
        await axios.post("https://service-frontend.nfadhil.me/acak-soal", data)
        return true
    }catch (e) {
        return await errorHandler.errorHandler(e)
    }

}

export default {
    generateTemplate,
    acakSoal
}
