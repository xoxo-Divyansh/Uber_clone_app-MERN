const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
   fullname:{
      firstname: {
         type: String,
         required: true,
         minlength: [3, "Fristname must be at least 3 characters long"],   
      },
      lastname: {
         type: String,
         minlength: [3, "Lastname must be at least 3 charecters long"], 
   }
},

   email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: [5, "Email must be at least 5 characters long"],
   },
   password:{
      type: String,
      required: true,
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
   },
   SocketId: String,  
   status:{
      type: String,
      enem: ["active", "inactive"],
      default: "inactive",
   },
   vehicle:{
      color:{
         type: String,
         required: true,
      },
      plate:{
         type: String,
         required: true,
         minlength: [3, "Plate must be at least 3 characters long"],
      },
      model:{
         type: String,
         minlength: [3, "Model must be at least 3 characters long"],
      },
      capacity:{
         type: Number,
         required: true,
         minlength: [1, "Capacity must be at least 1 characters long"],
      },
      vehicleType:{
         type: String,
         required: true,
         enum: ["car", "bike", "van", "tuktuk","suv"],
         minlength: [3, "Vehical Type must be at least 3 characters long"],
   }
},
   location:{
      latitude:{
         type: Number,
      },
      longitude:{
         type: Number,
   }

}
}
, { timestamps: true }
);


captainSchema.methods.generateAuthToken = function () {
   const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "24h"});
   return token;
}

captainSchema.methods.comparePassword = async function (password) {
   return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
   return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("caption", captainSchema);

module.exports = captainModel;