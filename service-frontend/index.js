const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path")
const cors = require("cors")
const soalValidator = require("./middleware/validator/soalValidator")
const soalController = require("./controller/soal")
const docxMulter = require("./middleware/multer/docxupload")
const corsOptionDelegate = (req , callback ) => {
    callback(null , {
        origin : req.header("Origin"),
        credentials : true
    })
}

const MessageBroker = require("./util/rabbitmq/MessageBroker")


app.use(express.urlencoded())
app.use(bodyParser.json());
app.use(cors(corsOptionDelegate))


app.use(
    "/docx",
    express.static(path.join(__dirname, "public", "docx"))
);

app.post("/generate-soal", soalValidator.generateTemplateValidator(), soalController.generateTemplate)
app.post("/acak-soal", docxMulter.imageUpload, soalValidator.acakSoalValidator(), soalController.acakSoal)

app.get("*", (req ,res ,next ) => {
    res.status(404).json({
        message: "Invalid URL",
        error: 404,
        cause: "No Url found",
    });
})

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message;
    const cause = error.cause || "Unknown";
    console.log(error);
    res.status(status).json({
        message: message,
        error: status,
        cause: cause,
    });
});


const init = async () => {
    try {
        // set port, listen for requests
        const PORT = process.env.PORT || 3000;
        await MessageBroker.getInstance()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (err) {
        console.log(err);
    }
};

init();
