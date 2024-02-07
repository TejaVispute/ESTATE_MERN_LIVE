import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
const Signup = () => {
  const naigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // saving form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Corrected header name
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success == false) {
        setLoading(false);
        setError(data.message);

        return;
      }
      alert(data.message);
      setLoading(false);
      setError(null);
      naigate("/sign-in");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Signup</h1>

      <form className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          className="border p-3 rounded-lg focus:outline-blue-400"
          id="username"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          className="border p-3 rounded-lg focus:outline-blue-400"
          id="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          type="text"
          name="password"
          className="border p-3 rounded-lg focus:outline-blue-400"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-slate-700 p-3 text-white rounded-lg uppercase font-bold hover:bg-slate-600 duration-200"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-4 mt-3">
        <p>have an account ?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">sign in</span>
        </Link>
      </div>
      <p className="text-red-600 font-bold">{error}</p>
    </div>
  );
};

export default Signup;
