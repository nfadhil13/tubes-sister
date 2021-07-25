const express = require("express");
const cors = require("cors");
const soalRoute = require("./routes/soal");
const morgan = require("morgan");
const path = require("path");
const MessageBroker = require("./util/rabbitmq/MessageBroker");
const app = express();
const soalController = require("./controllers/soal");
app.use(cors());

app.use(
  "/template",
  express.static(path.join(__dirname, "/public/docx/template-soal"))
);

app.use(
  "/docx",
  express.static(path.join(__dirname, "/public/docx/hasil-acak"))
);

app.use(express.json());

app.use(morgan("dev"));

// app.use("/", soalRoute);

// error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const cause = error.cause || "Internal Server Error";
  res.status(status).json({
    message: message,
    error: status,
    cause: cause
  });
});

const startServer = async () => {
  const PORT = process.env.SERVER_PORT || "5001";
  const messageBroker = await MessageBroker.getInstance();
  await messageBroker.subscribe("soalserivce/generate-template", (msg, ack) => {
    try {
      console.log("==================\nGenerate Template");
      console.log(msg.content.toString());
      const input = JSON.parse(msg.content.toString());
      soalController
        .generateTemplate(input.totalSoal, input.totalPilihan, input.email)
        .then((result) => {
          if (result) {
            ack();
          }
        })
        .catch((err) => {});
    } catch (e) {
      console.log(e);
    }
  });
  await messageBroker.subscribe("soalservice/acakSoal", (msg, ack) => {
    try {
      console.log("==================\nAcak Soal");
      console.log(msg.content.toString());
      const input = JSON.parse(msg.content.toString());
      soalController
        .acakSoal(input.email, input.urlFile, input.jumlahAcak)
        .then((result) => {
          if (result) {
            ack();
          }
        })
        .catch((err) => {});
    } catch (e) {
      console.log(e);
    }
  });
  app.listen(PORT, () => {
    console.log(`Service Soal listening at PORT ${PORT}`);
  });
};

startServer();
