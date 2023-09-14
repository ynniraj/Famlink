// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID;
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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

    res.status(200).send({
      msg: "OTP Send Successfully",
      data: { to: otpResponse.to, status: otpResponse.status },
    });
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

    if (verifyOtp.status === "approved") {
      try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
          const userRegister = await User.create({
            phoneNumber,
          });

          const token = jwt.sign(
            {
              id: userRegister._id,
            },
            "secretkey",
            { expiresIn: "1h" }
          );

          return res
            .status(200)
            .send({ token, userRegister, msg: "OTP Verified" });
        }

        const token = jwt.sign(
          {
            id: user._id,
          },
          "secretkey",
          { expiresIn: "1h" }
        );

        return res.status(200).send({ token, user, msg: "OTP Verified" });
      } catch (err) {
        res.status(500).send(err);
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { sendOtp, verifyUser };
