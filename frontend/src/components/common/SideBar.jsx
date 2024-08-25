import XSvg from "../svgs/X";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IoHomeSharp } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdDarkMode } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {useEffect, useState} from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (data.error) {
          toast.error(data.message, { id: "logout" });
        } else {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { data } = useQuery({ queryKey: ["authUser"] });
  const { data: notifications } = useQuery({ queryKey: ["notifications"] });
  const [theme, setTheme] = useState("retro");
  const toggleTheme = () => {
    setTheme(theme === "coffee" ? "retro" : "coffee");
  };
  // initially set the theme and "listen" for changes to apply them to the HTML tag
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <div className="flex flex-row gap-1">
          <Link to="/" className="flex justify-center md:justify-start">
            <XSvg className="px-2 w-12 h-12 rounded-full fill-black " />
          </Link>

          {/* <button onClick={toggleTheme}>Theme</button> */}
        </div>

        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoHomeSharp className="w-7 h-7" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/explore"
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaSearch className="w-7 h-6" />
              <span className="text-lg hidden md:block">Explore</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-primary  transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <div className="indicator">
                {notifications?.length > 0 && (
                  <span className="indicator-item badge badge-primary rounded-full w-6">
                    {notifications?.length > 9 ? "9+" : notifications?.length}
                  </span>
                )}
                <IoNotifications className="w-7 h-7" />
              </div>

              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          {/* <li className="flex justify-center md:justify-start">
            <Link
              onDoubleClick={() =>
                queryClient.invalidateQueries({ queryKey: ["posts"] })
              }
              to={`/profile/${data?.username}`}
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <div className="flex gap-2 items-center mt-0">
                <XSvg className="px-2 w-12 h-5 rounded-full fill-black " />
                <span className="text-lg hidden md:block">Profile</span>
              </div>
            </Link>
          </li> */}

          <li className="flex justify-center md:justify-start">
            <Link
              onDoubleClick={() =>
                queryClient.invalidateQueries({ queryKey: ["posts"] })
              }
              to={`/profile/${data?.username}`}
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-7 h-7" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/bookmarks`}
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaBookmark className="w-7 h-6" />
              <span className="text-lg hidden md:block">Bookmarks</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/messages`}
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaMessage className="w-7 h-6" />
              <span className="text-lg hidden md:block">Messages</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/settings"
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoSettingsSharp className="w-7 h-7" />
              <span className="text-lg hidden md:block">Settings</span>
            </Link>
          </li>
        </ul>
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-10 mr-3 flex gap-2 items-lef transition-all duration-300 hover:bg-primary py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-10 rounded-full border-solid border-2 border-primary">
                <img src={data?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-primary font-bold text-sm w-20 truncate">
                  {data?.fullname}
                </p>
                <p className="text-gray-500 text-sm">@{data?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
