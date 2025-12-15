import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import { signInSuccess,signInStart,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
export default function Singin() {
  const [formData, setFormData] = useState();
const {loading ,error} = useSelector((state) => state.user)
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // console.log(formData)

  const hanldleSubmit = async (e) => {
    e.preventDefault();
    try {
   dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {// connect from backend with this route.means data will enter into the database
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      //console.log(data);
      if (data.success == false) {
       dispatch(signInFailure(data.message));

        return;
      }
  dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
   
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7"> Sign In</h1>
      <form onSubmit={hanldleSubmit} className="flex flex-col gap-4">
        
        <input
          type="email"
          placeholder="email "
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        ></input>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg  uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an accoount?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700"> Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
