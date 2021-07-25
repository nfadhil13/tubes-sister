const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const emailRoute = require("./routes/emailRoute");
const MessageBroker = require("./utils/rabbitmq/MessageBroker");
const emailController = require("./controllers/emailController");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

// app.use("/email", emailRoute);

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
  const PORT = process.env.SERVER_PORT || 5002;
  const messageBroker = await MessageBroker.getInstance();
  await messageBroker.subscribe("emailService/template-soal", (msg, ack) => {
    try {
      const input = JSON.parse(msg.content.toString());
      emailController
        .sendUrlTemplateSoal(input.urlFile, input.email)
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
  await messageBroker.subscribe("emailService/acak-soal", (msg, ack) => {
    try {
      console.log("=================================");
      console.log("Acak Soal");
      console.log(msg.content.toString());
      const input = JSON.parse(msg.content.toString());
      emailController
        .sendUrlAcakSoal(input.urlFile, input.email)
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
    console.log(process.env.EMAIL);
    console.log(`Service Email listening at PORT ${PORT}`);
  });
};

startServer();
