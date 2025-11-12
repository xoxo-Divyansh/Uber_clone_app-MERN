const captionModel = require("../models/caption.model.js");
const captionService = require("../services/caption.service.js");
const { validationResult } = require("express-validator");

module.exports.registerCaption = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   const { fullname, email, password, vehical } = req.body;
   
   const isCaptionAlreadyExists = await captionModel.findOne({ email });
   if (isCaptionAlreadyExists) {
      return  res.status(409).json({ message: "Caption with this email already exists" });
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
      vehicalType: vehical.vehicalType
   });
   const token = caption.generateAuthToken();

   res.status(201).json({ token, caption });
};
