const express = require ("express");
const router = express.Router();
const { body } = require("express-validator");
const captionController = require("../controllers/caption.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const userModel = require("../models/user.model.js");

router.post("/register",[
   body("email").isEmail().withMessage("Invelid email Formate"),
   body("fullname.firstname").isLength({ min: 3 }).withMessage("Firstname must be at least 3 characters long"),
   body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
   body("vehical.color").notEmpty().withMessage("Vehical color is required"),
   body("vehical.plate").isLength({ min: 3 }).withMessage("Plate must be at least 3 characters long"),
   body("vehical.capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1 characters long"),
   body("vehical.vehicalType").isIn(['car', 'bike', 'van', 'tuktuk','suv']).withMessage("Invalid vehical type"),
]
   ,captionController.registerCaption
);

module.exports = router;