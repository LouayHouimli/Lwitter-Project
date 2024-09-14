import { FaSquareXTwitter } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useFollow from "../hooks/useFollow";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

const User = ({ user }) => {
  const navigate = useNavigate();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const followers = document.getElementById("followers");
  const following = document.getElementById("following");
  return (
    <div key={user._id} className="flex gap-3 items-start ">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center justify-between gap-4"
        onClick={() => navigate(`/profile/${user.username}`)}
      >
        {followers && document.getElementById("followers").close()}
        {following && document.getElementById("following").close()}

        <div className="avatar">
          <div className="w-8 rounded-full">
            <img src={user.profileImg || "/avatar-placeholder.png"} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold ">{user.fullname}</span>
            {user.isVerified && (
              <span className="flex flex-row gap-1">
                <MdVerified className="text-blue-500" title="Verified Member" />
                {user.isMod && <FaSquareXTwitter title="Lwitter Mod" />}
              </span>
            )}
            <span className=" text-sm">@{user.username}</span>
          </div>
          <div></div>
        </div>
      </Link>
      <div className="flex flex-1 items-center">
        {user?._id !== authUser?._id && (
          <button
            disabled={isPending}
            className="btn bg-white text-black mt-0 hover:bg-white hover:opacity-90 rounded-full btn-sm  "
            onClick={(e) => {
              e.preventDefault(), follow(user._id);
            }}
          >
            {isPending && <LoadingSpinner size="sm" />}
            {!isPending &&
              (user?.followers.includes(authUser?._id) ? (
                "Unfollow"
              ) : user?.following.includes(authUser?._id) ? (
                <p title={user.username + " is already following you"}>
                  Follow
                </p>
              ) : (
                "Follow"
              ))}
          </button>
        )}
      </div>
    </div>
  );
};

export default User;
