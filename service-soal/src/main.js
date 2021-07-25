const  express = require("express")
const  cors = require("cors")
const soalRoute = require( "./routes/soal")
const path = require("path")
const app = express();


app.use(cors());

app.use(
    "docx",
    express.static(path.join(__dirname, "public", "docx", "hasil-acak"))
);


app.use(express.json());



app.use("/", soalRoute)
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
    console.log(`Service Soal listening at PORT ${PORT}`);
  });
};

startServer();
