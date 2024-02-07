import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
const SignIn = () => {
  const naigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  // saving form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Corrected header name
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success == false) {
        dispatch(signInFailure(data.message));

        return;
      }
      dispatch(signInSuccess(data));
      naigate("/");
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Signin</h1>

      <form className="flex flex-col gap-4">
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
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-4 mt-3">
        <p>dont have an account ?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">sign up</span>
        </Link>
      </div>
      <p className="text-red-600 font-bold text-center">{error}</p>
    </div>
  );
};

export default SignIn;
