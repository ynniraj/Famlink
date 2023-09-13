// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID;

const client = require("twilio")(accountSid, authToken);

const sendOtp = async (req, res) => {
  const { countryCode, phoneNumber } = req.body;

  try {
    const otpResponse = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: `+${countryCode}${phoneNumber}`,
        channel: "sms",
      });

    res.status(200).send(otpResponse);
  } catch (err) {
    res.status(400).send(err);
  }
};

const verifyUser = async (req, res) => {
  const { countryCode, phoneNumber, otp } = req.body;

  try {
    const verifyOtp = await client.verify.v2
      .services(serviceId)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: `${otp}`,
      });
    res.status(200).send(verifyOtp);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { sendOtp, verifyUser };
