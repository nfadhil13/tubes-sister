const mailUtil = require("../utils/mail");

exports.sendUrlTemplateSoal = async (urlFile,emailRecipient) => {
  try {
    const resultSendEmail = await mailUtil.sendUrlTemplateSoal(
      urlFile,
      emailRecipient
    );
    if (resultSendEmail instanceof Error) {
      throw resultSendEmail;
    }
    return true
  } catch (error) {
    console.log(error)
    return false
  }
};

exports.sendUrlAcakSoal = async (urlFile, emailRecipient) => {
  try {
    const resultSendEmail = await mailUtil.sendUrlAcakSoal(
      urlFile,
      emailRecipient
    );
    if (resultSendEmail instanceof Error) {
      throw resultSendEmail;
    }
    return true
  } catch (error) {
    console.log(error)
    return false
  }
};
