const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

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
  const PORT = process.env.EMAIL || "3000";
  app.listen(process.env.EMAIL, () => {
    console.log(`Service Email listening at PORT ${PORT}`);
  });
};

startServer();