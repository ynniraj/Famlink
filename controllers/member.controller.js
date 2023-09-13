const Member = require("../models/member.model");

const createMember = async (req, res) => {
  const { name, email, relation } = req.body;

  try {
    const member = await Member.create({
      name,
      email,
      relation,
      userId: req.user,
    });

    return res.status(200).send(member);
  } catch (error) {
    return res.status(404).json({ status: "error" });
  }
};

const getMember = async (req, res) => {
  try {
    const getMember = await Member.find({ userId: req.user }).lean().exec();
    return res.status(200).send(getMember);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = { createMember, getMember };
