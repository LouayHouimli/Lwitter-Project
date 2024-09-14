import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { POSTS } from "../../utils/db/dummy";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import formatMembershipDate from "../../utils/formatMemberSinceDate";
import useFollow from "../../components/hooks/useFollow";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import "../../index.css";
import XSvg from "../../components/svgs/X";
import User from "../../components/common/User";

const ProfilePage = () => {
  
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const queryClient = useQueryClient();
  
  // const { data: user } = useQuery({ queryKey: ["authUser"] });

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: POSTS } = useQuery({ queryKey: ["posts"] });
  const { username } = useParams();
  const { follow, isPending } = useFollow();

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const {
    data: userFollowers,
    refetch: refetchUserFollowers,
  } = useQuery({
    queryKey: ["userFollowers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/followers/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

   const { data: userFollowing, refetch: refetchUserFollowing } = useQuery({
     queryKey: ["userFollowing"],
     queryFn: async () => {
       try {
         const res = await fetch(`/api/users/following/${username}`);
         const data = await res.json();
         if (!res.ok) {
           throw new Error(data.message);
         }
         return data;
       } catch (error) {
         console.log(error);
       }
     },
   });
  useEffect(() => {
    refetchUserFollowers();
    refetchUserFollowing();
  }, [username]);



  const memberSince = formatMembershipDate(user?.createdAt);
  const isMyProfile = authUser?._id === user?._id;


  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async () => {
      return toast.promise(
        (async () => {
          try {
            const res = await fetch(`/api/users/update`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                profileImg,
                coverImg,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message);
            }

            return data;
          } catch (error) {
            console.log(error);
            throw error; // Rethrow the error to be caught by toast.promise
          }
        })(),
        {
          loading: "Updating...",
          success: <b>Profile updated successfully!</b>,
          error: <b>Could not update profile.</b>,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg"
          ? setCoverImg(reader.result)
          : setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
      reset();
    }
  };
  useEffect(() => {
    document.title = `Profile - ${user?.fullname}`;
    refetch();
  }, [username, refetch, user]);

  return (
    <>
      <dialog id="following" className="modal">
        <div className="modal-box w-1/2">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Following</h3>
            <div className="flex flex-col gap-3  ">
              {userFollowing?.following.length === 0 && (
                <p className="text-center text-lg mt-4 font-bold">
                  {isMyProfile
                    ? "You Are Not Following Anyone Yet 😢"
                    : user?.username + " Is Not Following Anyone Yet 😢 "}
                </p>
              )}
              {userFollowing?.following.length !== 0 &&
                userFollowing?.following.map((user) => (
                  <User key={user._id} user={user} />
                ))}
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="followers" className="modal">
        <div className="modal-box w-1/2">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Followers</h3>
            <div className="flex flex-col gap-3  ">
              {userFollowers?.followers.length === 0 && (
                <p className="text-center text-lg mt-4 font-bold">
                  {isMyProfile
                    ? "You Have No Followers Yet 😢"
                    : user?.username + " Has No Followers Yet 😢 "}
                </p>
              )}
              {userFollowers?.followers.length !== 0 &&
                userFollowers?.followers.map((user) => (
                  <User key={user._id} user={user} />
                ))}
            </div>
          </div>
        </div>
      </dialog>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {isLoading || (isRefetching && <ProfileHeaderSkeleton />)}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}

        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullname}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-primary bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  accept="image/*"
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />

                    {isMyProfile && (
                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && <LoadingSpinner size="sm" />}
                    {!isPending &&
                      (user?.followers.includes(authUser?._id)
                        ? "Unfollow"
                        : user?.following.includes(authUser?._id)
                        ? "Follow Back"
                        : "Follow")}
                  </button>
                )}
                {(coverImg || profileImg) && !isSuccess && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => {
                      updateProfile();
                    }}
                  >
                    {/* {isUpdatingProfile ?  : "Save"} */}
                    {isUpdatingProfile ? "Updating..." : "Save"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg flex items-center">
                      <span className="mt-0.5 ">{user?.fullname}</span>

                      <span className="flex flex-row gap-1">
                        {user?.isVerified && (
                          <MdVerified
                            className="text-blue-500 ml-1 align-middle cursor-pointer" // Ensure alignment
                            aria-label="verified"
                            title="Verified Member"
                          />
                        )}
                        {user?.isMod && (
                          <FaSquareXTwitter
                            title="Lwitter Mod"
                            className="cursor-pointer  "
                          />
                        )}
                      </span>
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>

                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={`https://${user?.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSince}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("following").showModal()
                    }
                  >
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("followers").showModal()
                    }
                  >
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500  transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
