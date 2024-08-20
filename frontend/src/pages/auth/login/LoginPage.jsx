import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { useMutation } from "@tanstack/react-query";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), 
        });
        const data = await res.json();
        if (data.message) {
          toast.error(data.message, { id: "login" });
        } else {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message, { id: "login" });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please provide all required fields", { id: "login" });
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        id: "signup",
      });
      return;
    }
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-black" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-black" />
          <h1 className="text-4xl font-extrabold text-black">{"Let's"} go.</h1>
          
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
          

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
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-black text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
