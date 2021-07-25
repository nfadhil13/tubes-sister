const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const emailRoute = require("./routes/emailRoute");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use("/email", emailRoute);

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

const startServer = () => {
  const PORT = process.env.SERVER_PORT || "3000";
  app.listen(PORT, () => {
    console.log(`Service Email listening at PORT ${PORT}`);
  });
};

startServer();
