import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthFInder from "../../API/AuthFInder";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthFInder.post("register", {
        name: name,
        email: email,
        password: password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError(response.data.error || "Registration failed");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      setError(error.response.data.error || "Something went wrong");
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://images.unsplash.com/photo-1497671954146-59a89ff626ff?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hbGwlMjBmaXNofGVufDB8fDB8fHww"
          alt=""
          className="w-full h-full"
        />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="md:text-4xl font-bold leading-tight mt-12 text-center">
            Register for an account
          </h1>

          <form className="mt-6" action="#" method="POST" onSubmit={onSubmit}>
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter Your Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Email Address</label>
              <input
                type="text"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="text-right mt-1">
              <Link
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
              Log In
            </button>
          </form>

          <p className="mt-1">
            Already have an account{"? "}
            <Link
              to={"/login"}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              click here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
