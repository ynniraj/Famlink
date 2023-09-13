const express = require("express");
const cors = require("cors");
const { sendOtp, verifyUser } = require("./controllers/send.controller");

const app = express();
const connect = require("./confiq/db");
const { login } = require("./controllers/auth.controller");
const { updateProfile } = require("./controllers/profile.controller");
const { verifyToken } = require("./middlewares/verifyToken");
const { createMember, getMember } = require("./controllers/member.controller");

app.use(cors());
app.use(express.json());

app.post("/api/send-otp", sendOtp);
app.post("/api/verify-otp", verifyUser);
app.post("/api/create-user", login);
app.post("/api/update-profile", verifyToken, updateProfile);
app.post("/api/add-member", verifyToken, createMember);
app.get("/api/get-member", verifyToken, getMember);

app.listen(8080, async () => {
  try {
    await connect();
    console.log("server is running on port 8080");
  } catch (e) {
    console.log(e);
  }
});
