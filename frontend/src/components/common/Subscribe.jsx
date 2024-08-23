import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../common/LoadingSpinner";
import useFollow from "../hooks/useFollow";
import { MdVerified } from "react-icons/md";

const Subscribe = () => {
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="p-4 rounded-md sticky top-2 border-2 border-black max-w-xs">
        <p className="font-bold mb-2 text-xl">Subscribe To Lwitter</p>

        <p className="break-words whitespace-normal text-justify font-medium">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
              </p>
              <button className="btn btn-primary w-1/3 mt-4 rounded-full text-black ">Subscribe</button>
      </div>
    </div>
  );
};

export default Subscribe;
