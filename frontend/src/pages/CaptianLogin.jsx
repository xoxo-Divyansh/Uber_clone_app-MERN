import { useState } from "react";
import { Link } from "react-router-dom";

function CaptianLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captianData, setCaptianData] = useState({})



  const submitHandler = (e) => {
    e.preventDefault();
    setCaptianData({
      email:email,
      password
    })
    console.log(captianData);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen p-5 flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-5"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Uber.png"
        />
        <form
          action=""
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="text-[#0e0e0e]"
        >
          <h3 className="text-xl mb-2 font-bold">What's your email</h3>
          <input
            required
            value={email}
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email@example.com"
            className=" mb-4 rounded px-4 py-2 border w-full font-semibold text-lg placeholder:text-base"
          />
          <h3 className="text-xl mb-2 font-bold">Enter your password</h3>
          <input
            required
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter Password"
            className="mb-5 rounded px-4 py-2 border w-full font-semibold text-lg placeholder:text-md"
          />
          <button className="rounded-lg bg-[#0e0e0e] text-white text-lg font-bold py-2 px-5 mb-4 w-full">
            Login
          </button>
          <p className="text-lg text-center tracking-tighter pb-2">
            Join in as Uber-Driver?{" "}
            <Link
              to={"/captian-signup"}
              className="text-md font-semibold text-blue-600"
            >
             Register as Driver
            </Link>
          </p>
        </form>
      </div>
      <div className="">
        <Link to={"/user-login"} className="rounded-3xl bg-[#f73d8d] text-white text-lg py-3 px-5 flex items-center justify-center">
          Sign in as User
        </Link>
      </div>
    </div>
  );
}

export default CaptianLogin;
