const mailUtil = require("../utils/mail");

exports.sendUrlTemplateSoal = async (req, res, next) => {
  try {
    const urlFile = req.body.urlFile;
    const emailRecipient = req.body.email;
    const resultSendEmail = await mailUtil.sendUrlTemplateSoal(
      urlFile,
      emailRecipient
    );
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
