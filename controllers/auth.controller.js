const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { phoneNumber } = req.body;

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

      return res.status(200).send({ token, userRegister });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).send({ token, user });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { login };
