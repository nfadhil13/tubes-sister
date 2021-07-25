const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const smtpConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PW
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

transporter.verify((err, success) => {
  if (err) return new Error(err);
  console.log("nodemailer config is correct");
});

exports.sendUrlTemplateSoal = async (urlSoal, recipient) => {
  const address = {
    name: "Admin Yuk Acak",
    address: process.env.EMAIL
  };
  return await transporter.sendMail({
    from: address,
    to: recipient,
    subject: "File Template Soal",
    template: "sendUrlFile",
    context: {
      urlFile: urlSoal
    }
  });
};

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: "src/utils/views/partials",
    layoutsDir: "src/utils/views/layouts",
    defaultLayout: ""
  },
  viewPath: "src/utils/views/template",
  extName: ".handlebars"
};

transporter.use("compile", hbs(handlebarOptions));
