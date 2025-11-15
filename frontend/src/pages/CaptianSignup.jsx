import { useState } from "react";
import { Link } from "react-router-dom";

function CaptianSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captianData, setCaptianData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setCaptianData({
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password,
    });
    console.log(captianData);
    setEmail("");
    setPassword("");
    setLastName("");
    setFirstName("");
  };

  return (
    <div className="h-screen p-4 flex flex-col justify-between">
      <div>
        <img
          className="w-15 border-3 rounded-xl mb-5"
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
          <h3 className="text-xl mb-2 font-bold">What's our Captian name</h3>
          <div className="flex gap-1">
            <input
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              type="text"
              placeholder="Frist Name"
              className=" mb-4 rounded px-4 py-2 w-1/2 font-semibold text-lg text-center bg-zinc-200 placeholder:text-base"
            />
            <input
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              type="text"
              placeholder="Last Name"
              className=" mb-4 rounded px-4 py-2 w-1/2 font-semibold text-lg text-center bg-zinc-200 placeholder:text-base"
            />
          </div>
          <h3 className="text-xl mb-2 font-bold">What's our Captian email</h3>
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
            to={"/captian-login"}
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
        <Link
          to={"/captian-login"}
          className="rounded-3xl bg-[#10c267] text-white text-lg font-bold py-3 px-5 flex items-center justify-center"
        >
          Sign in as Captian
        </Link>
      </div>
    </div>
  );
}

export default CaptianSignup;
