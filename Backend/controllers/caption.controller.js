const captionModel = require("../models/caption.model.js");
const captionService = require("../services/caption.service.js");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model.js");

module.exports.registerCaption = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehical } = req.body;

  const isCaptionAlreadyExists = await captionModel.findOne({ email });
  if (isCaptionAlreadyExists) {
    return res
      .status(409)
      .json({ message: "Caption with this email already exists" });
  }

  const hashedPassword = await captionModel.hashPassword(password);

  const caption = await captionService.createCaption({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    plate: vehical.plate,
    color: vehical.color,
    capacity: vehical.capacity,
    vehicalType: vehical.vehicalType,
  });
  const token = caption.generateAuthToken();

  res.status(201).json({ token, caption });
};

module.exports.loginCaption = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const caption = await captionModel.findOne({ email }).select("+password");

  if (!caption) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await caption.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = caption.generateAuthToken();

  res.status(200).json({ token, caption });
};

module.exports.getCaptionProfile = async (req, res, next) => {
  res.status(200).json({ caption: req.caption });
};

module.exports.logoutCaption = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    await blacklistTokenModel.updateOne(
      { token },
      { $setOnInsert: { token } },
      { upsert: true }
    );

    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
