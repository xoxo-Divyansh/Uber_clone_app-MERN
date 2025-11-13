const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const blacklistTokenModel = require("../models/blacklistToken.model.js");
const captionModel = require("../models/caption.model.js"); 


module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
     // 🔍 Check if token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({message: "Unauthorized: Token is blacklisted"});
    }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user){
        return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports.authCaption = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];  
  // console.log("Auth Caption Middleware - Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  } 
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    console.log("Is token blacklisted?", isBlacklisted);
    if (isBlacklisted) {
      return res.status(401).json({message: "Unauthorized: Token is blacklisted"});
    }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const caption = await captionModel.findById(decoded._id);
    req.caption = caption;
    return next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}