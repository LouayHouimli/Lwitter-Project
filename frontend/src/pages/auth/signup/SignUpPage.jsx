import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import Axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import XSvg from "../../../components/svgs/X";
import {useQueryClient} from "@tanstack/react-query";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
  document.title = "Signup up for X / X";
  const navigate = useNavigate();
  const intervalId = useRef();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const { mutate:signupMutation, isError, isPending, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await Axios.post("/api/auth/signup", formData);
        const data = res.data; 

        if (data.message) {
          toast.error(data.message, { id: "signup" });
        } else {
          toast.success(
            `Account created successfully. You'll be redirected to the home page in a few seconds`,
            { id: "signup" }
          );
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
           }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred", {
          id: "signup",
        });
      }

      
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.username || !formData.fullname || !formData.password) {
      toast.error("Please provide all required fields", { id: "signup" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email address format", { id: "signup" });
      return;;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", { id: "signup" });
      return;
    }




    signupMutation(formData);
    
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-black" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-black" />
          <h1 className="text-4xl font-extrabold text-black">Join today.</h1>
          {isError && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error.message}</span>
            </div>
          )}

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />

            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullname"
                onChange={handleInputChange}
                value={formData.fullname}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button
            className="btn rounded-full btn-primary text-black"
            onClick={handleSubmit}
            disabled={isPending}
            
          >
           {isPending ? "Loading..." : "Sign up"}
          </button>
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-black text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
