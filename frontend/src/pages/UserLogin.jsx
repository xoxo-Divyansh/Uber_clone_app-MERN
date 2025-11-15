import { useState } from "react";
import { Link } from "react-router-dom";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({})



  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      email:email,
      password
    })
    console.log(userData);
    setEmail("");
    setPassword("");
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
          <h3 className="text-xl mb-2 font-bold">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="email@example.com"
            className=" mb-4 rounded px-4 py-2 w-full font-semibold text-lg bg-zinc-200 placeholder:text-base"
          />
          <h3 className="text-xl mb-2 font-bold">What's your password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Enter Password"
            className=" mb-4 rounded px-4 py-2 w-full font-semibold text-lg bg-zinc-200 placeholder:text-base"
          />
          <button className="rounded-lg bg-[#0e0e0e] text-white text-lg font-bold py-2 px-5 mb-4 w-full">
            Login
          </button>
          <p className="text-lg text-center">
            New here?{" "}
            <Link
              to={"/user-signup"}
              className="text-md font-semibold text-blue-600"
            >
              Create new Account
            </Link>
          </p>
        </form>
      </div>
      <div className="">
        <Link to={"/captian-login"} className="rounded-3xl bg-[#10c267] text-white text-lg font-bold py-3 px-5 flex items-center justify-center">
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
}

export default UserLogin;
