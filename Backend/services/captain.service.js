const captainModel = require("../models/captain.model.js");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  plate,
  color,
  capacity,
  vehicleType,
}) => {
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !plate ||
    !color ||
    !capacity ||
    !vehicleType
  ) {
      throw new Error("All fields are required to create a captain");
  }

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color: color,      // Corrected
      plate: plate,      // Corrected
      capacity: capacity, // Corrected
      vehicleType: vehicleType,
    },
  });

  return captain;
};
