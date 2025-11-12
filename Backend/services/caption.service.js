const captionModel = require("../models/caption.model.js");

module.exports.createCaption = async ({
   firstname, lastname, email, password, 
    plate, color, capacity, vehicalType
}) => {
   if (!firstname || !lastname || !email || !password || !plate || !color || !capacity || !vehicalType) {
      throw new Error("All fields are required to create a caption");
   }
   const caption = captionModel.create({
      fullname: {
         firstname, lastname
      },
      email,
      password,
      vehical: {
         plate, color, capacity, vehicalType
      }
   });
   return caption;
}