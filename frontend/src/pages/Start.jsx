import React from "react";
import { Link } from "react-router-dom";

function Start() {
  return (
    <div>
      <div
        className="h-screen w-full flex flex-col justify-between bg-pink-500
       bg-cover bg-center bg-[url(https://images.pexels.com/photos/2422270/pexels-photo-2422270.jpeg)]"
      >
        <img
          className="w-20 ml-15 mt-20 border-3 rounded-xl"
          src="https://logodownload.org/wp-content/uploads/2015/05/uber-logo-1-1.png"
          alt="Uber.png"
        />
        <div className="bg-white text-center font-bold p-2">
          <h2 className="text-3xl mb-2">Git Started with Uber.</h2>
          <Link
            to={"/login"}
            className="inline-block rounded-2xl bg-black text-white p-2 w-full"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
