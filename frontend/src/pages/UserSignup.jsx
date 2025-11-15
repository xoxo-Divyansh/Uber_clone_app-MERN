import { useState } from "react";
import { Link } from "react-router-dom";

function UserSignup() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({})
  


  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      fullname:{
        firstName:firstName,
        lastName:lastName,
      },
      email,
      password
    })
    
console.log(userData)
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="h-screen p-5 flex flex-col justify-between">
      <div>
        <img
          className="w-20 border-3 rounded-xl p-2 mb-8"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt="Uber.png"
        />
        <form
          action=""
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="text-[#0e0e0e]"
        >
          <h3 className="text-xl mb-2 font-bold">What's your name</h3>
         <div className="flex gap-1">
           <input required
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            type="text"
            placeholder="Frist Name"
            className=" mb-4 rounded px-4 py-2 w-1/2 font-semibold text-lg text-center bg-zinc-200 placeholder:text-base"
          />
           <input required
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            type="text"
            placeholder="Last Name"
            className=" mb-4 rounded px-4 py-2 w-1/2 font-semibold text-lg text-center bg-zinc-200 placeholder:text-base"
          />
            
          
         </div>
          <h3 className="text-xl mb-2 font-bold">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="emial"
            placeholder="enter your email"
            className="mb-5 rounded px-4 py-2 w-full font-semibold text-lg bg-zinc-200 placeholder:text-base"
          />
          <h3 className="text-xl mb-2 font-bold">What's your password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="enter your password"
            className="mb-5 rounded px-4 py-2  w-full font-semibold text-lg bg-zinc-200 placeholder:text-base"
          />
          <button className="rounded-lg bg-[#0e0e0e] text-white text-lg font-bold py-2 px-5 mb-4 w-full">
            Login
          </button>
        </form>
          <p className="text-lg text-center">
            Alteady have an Account?{" "}
            <Link
              to={"/user-login"}
              className="text-md font-semibold text-blue-600"
            >
              Login Account
            </Link>
          </p>
            <div>
          <p className="text-md text-zinc-700 text-wrap p-5 tracking-tighter">
            The site is protected by reCAPTCHA and{" "}
            <span className="text-purple-600 text-sm font-semibold underline">
              Google Privacy Policy
            </span>{" "}
            <span>Terms of Service apply.</span>
          </p>
        </div>
      </div>
      <div className="">
        <Link to={"/user-login"}
         className="rounded-3xl bg-[#10c267] text-white text-lg font-bold py-3 px-5 flex items-center justify-center">
          Sign in as User
        </Link>
      </div>
    </div>
  );
}

export default UserSignup;
