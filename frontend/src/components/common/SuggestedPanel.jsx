import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../common/LoadingSpinner";
import useFollow from "../hooks/useFollow";
import { MdVerified } from "react-icons/md";

const SuggestedPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0)
    return (
      <div className="hidden lg:block my-3 mx-2">
        <div className="md:w-64 w-0"></div>
      </div>
    );

  return (
    <div className="hidden lg:block my-4 mx-2 ">
      <div className=" p-4 rounded-md sticky top-2 border-2 border-black  ">
        <p className="font-bold mb-3 text-xl">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-full space">
                      <p className="flex items-center gap-2 ">
                        {user?.fullname}{" "}
                        {user?.isVerified && (
                          <MdVerified
                            className="text-gray-700 "
                            aria-label="verified"
                            title="Verified Member"
                          />
                        )}
                      </p>
                    </span>

                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    disabled={isPending}
                    className="btn bg-white text-black mt-0 hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault(), follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedPanel;
