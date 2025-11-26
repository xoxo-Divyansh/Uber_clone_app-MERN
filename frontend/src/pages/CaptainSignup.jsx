import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {CaptainDataContext} from "../context/CaptainDataContext"


const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // vehicle details
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      // vehicle obj added ✔
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number.parseInt(vehicleCapacity),
        vehicleType: vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        console.log(data.captain)
        localStorage.getItem("token", data.token)
        navigate("/captain-home");
      }

      // Reset Inputs
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
    } catch (error) {
      if (error.response) {
        console.log("Error:", error.response.data);
        console.log("Status:", error.response.status);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div className="h-screen p-2 flex flex-col justify-between">
      <div>
        <img
          className="w-15 border-3 rounded-xl mb-3"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Uber.png"
        />

        <form onSubmit={submitHandler} className="text-[#0e0e0e]">
          {/* Name */}
          <h3 className="text-xl mb-2 font-bold">What's our Captain name</h3>
          <div className="flex gap-1">
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
              className="rounded w-1/2 p-2 mb-2 font-semibold text-lg text-center bg-zinc-200"
            />
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
              className="rounded w-1/2 p-2 mb-2 font-semibold text-lg text-center bg-zinc-200"
            />
          </div>

          {/* Email */}
          <h3 className="text-xl mb-2 font-bold">What's our Captain email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="enter your email"
            className="mb-2 rounded p-2 mb-2 w-full font-semibold text-lg bg-zinc-200"
          />

          {/* Password */}
          <h3 className="text-xl mb-2 font-bold">What's your password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="enter your password"
            className="mb-2 rounded p-2 w-full font-semibold text-lg bg-zinc-200"
          />

          {/* 🚗 VEHICLE DETAILS */}
          <h3 className="text-xl font-bold">Vehicle Details</h3>

          <div className="flex flex-row flex-wrap py-2 mb-2">
            <input
            required
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            type="text"
            placeholder="Vehicle Color"
            className=" rounded py-2 my-1 w-1/2 text-center bg-zinc-200"
          />

          <input
            required
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            type="text"
            placeholder="Vehicle Plate Number"
            className=" rounded py-2 my-1 w-1/2 text-center bg-zinc-200"
          />

          <select
            required
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className=" rounded py-2 my-1 w-1/2 text-center bg-zinc-200"
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="van">Van</option>
            <option value="tuktuk">Tuktuk</option>
            <option value="suv">SUV</option>
          </select>

          <input
            required
            value={vehicleCapacity}
            onChange={(e) => {const value = Number(e.target.value);
              if (value < 1){setVehicleCapacity(1);}else {setVehicleCapacity(value);}}}
            type="number"
            placeholder="Seating Capacity"
            className=" rounded py-2 my-1 w-1/2 text-center bg-zinc-200"
          />
          </div>

          <button className="rounded-lg bg-[#0e0e0e] text-white text-lg font-bold py-2 px-5 mb-2 w-full">
            Create Account
          </button>
        </form>

        <p className="text-lg tracking-tighter text-center">
          Already have an Account?{" "}
          <Link
            to="/captain-home"
            className="text-base font-bold underline text-blue-600"
          >
            Login here
          </Link>
        </p>

        <div>
          <p className="text-zinc-600 text-sm text-center px-2 tracking-tighter leading-none my-2">
            The site is protected by reCAPTCHA and{" "}
            <span className="text-purple-600 text-md font-semibold underline">
              Google Privacy Policy
            </span>{" "}
            <span>Terms of Service apply.</span>
          </p>
        </div>
      </div>

      <div>
        <Link
          to="/captain-login"
          className="rounded-3xl bg-[#10c267] text-white text-base font-semibold inline-block flex items-center justify-center w-full text-center p-2 mb-2"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default CaptainSignup;
