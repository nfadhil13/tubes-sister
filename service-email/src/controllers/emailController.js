const mailUtil = require("../utils/mail");

exports.sendUrlFile = async (req, res, next) => {
  try {
    const urlFile = req.body.urlFile;
    const emailRecipient = req.body.email;
    const resultSendEmail = await mailUtil.sendUrlSoal(urlFile, emailRecipient);
    if (resultSendEmail instanceof Error) {
      throw resultSendEmail;
    }
    res.status(200).json({
      message: `Sukses mengirim url file ke email ${emailRecipient}`,
      data: resultSendEmail
    });
  } catch (error) {
    next(error);
  }
};
