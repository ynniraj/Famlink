const User = require("../models/user.model");

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { updateProfile };
