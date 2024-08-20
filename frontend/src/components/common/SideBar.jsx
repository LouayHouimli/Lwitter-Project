import XSvg from "../svgs/X";

import { IoHomeSharp } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";

const Sidebar = () => {
  const data = {
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy1.png",
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-black " />
        </Link>
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
              to="/notifications"
              className="flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-7 h-7" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
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
                <p className="text-black font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-black text-sm">@{data?.username}</p>
              </div>
              <BiLogOut className="w-5 h-5 cursor-pointer" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
