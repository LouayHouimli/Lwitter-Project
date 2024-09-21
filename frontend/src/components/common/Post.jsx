import { FaCopyright, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark, FaXTwitter } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdReport, MdVerified } from "react-icons/md";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import formatPostDate from "../../utils/formatPostDate";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaSadTear } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const containerRef = useRef(null);
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const formatedDate = post.createdAt.substring(
    0,
    post.createdAt.lastIndexOf("T")
  );

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const isMyPost = authUser._id === postOwner._id;
  const isMod = authUser?.isMod;
  const doIReposted = post.reposts.includes(post.user?._id);

  const formattedDate = formatPostDate(post.createdAt);
  const formatCommentDate = formatPostDate(comment.createdAt);
  const isLiked = post.likes.includes(authUser._id);
  const isBookmarked = post.bookmarks.includes(authUser._id);

  const { mutate: deletePostMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await Axios.delete(`/api/posts/delete-post/${post._id}`);
        const data = res.data;
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Post deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
      } catch (error) {}
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        setComment("");
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (updatedComments) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: [
                ...p.comments.filter(
                  (comment) =>
                    !updatedComments.find(
                      (newComment) => newComment._id === comment._id
                    )
                ),
                ...updatedComments,
              ],
            };
          }
          return p;
        });
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  // Mod Section
  const { mutate: CopyrightPost } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/mod/copyrightContent/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, isCopyrighted: data.isCopyrighted };
          }
          return p;
        });
      });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const { mutate: bookmarkPost, isPending: isBookMarking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/bookmark/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (updatedBookmarks) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, bookmarks: updatedBookmarks };
          }
          return p;
        });
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleDeletePost = async () => {
    deletePostMutation();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (comment === "") {
      toast.error("Please provide a comment");
      return;
    }
    if (isCommenting) return;
    commentPost();
  };

  const handleBookmarkPost = async () => {
    if (isBookMarking) return;
    bookmarkPost();
  };
  const handleLikePost = async () => {
    if (isLiking) return;
    likePost();
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [post.comments]);

  const renderText = (text) => {
    const parts = text.split(/(\s+)/); // Split by spaces to retain the spaces in the result

    return parts.map((part, index) => {
      // Handle hashtags
      if (part.startsWith("#") && /^[#a-zA-Z\d_]+$/.test(part)) {
        const tag = part.slice(1); // Remove the '#' for the link
        return (
          <Link
            key={index}
            to={`/explore/${tag}`}
            className="text-primary inline"
          >
            {part}
          </Link>
        );
      }
      // Handle mentions
      if (part.startsWith("@") && /^[@a-zA-Z\d_]+$/.test(part)) {
        const username = part.slice(1); // Remove the '@' for the link
        return (
          <Link
            key={index}
            to={`/profile/${username}`}
            className="text-primary inline"
          >
            {part}
          </Link>
        );
      }
      if (
        /^(https?:\/\/)?([a-zA-Z\d-]+\.)*[a-zA-Z\d-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
          part
        )
      ) {
        // Ensure the part starts with "http://" or "https://"
        const fullLink =
          part.startsWith("https://") || part.startsWith("http://")
            ? part
            : "https://" + part; // Default to "https://" if no protocol is provided

        // Slice off the protocol for display purposes
        const slicedPart = fullLink.startsWith("https://")
          ? fullLink.slice(8)
          : fullLink.slice(7);

        return (
          <a
            key={index}
            className="text-primary inline"
            target="_blank"
            href={fullLink + "?lwitterclick=" + Date.now()} // Append the tracking parameter
          >
            {slicedPart}
          </a>
        );
      }


      // Return the part unchanged if it's neither a hashtag nor a mention
      return part;
    });
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700  ">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-9 h-9 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center ">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              <p className="flex justify-center items-center flex-row gap-1 leading-none">
                {postOwner.fullname}
                {postOwner?.isVerified && (
                  <MdVerified
                    className="text-blue-400 flex-shrink-0 text-base align-middle "
                    aria-label="verified"
                    title="Verified Member"
                  />
                )}
                {postOwner?.isMod && <FaSquareXTwitter />}
              </p>
            </Link>
            <p className=" flex gap-1 text-sm  ">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
            </p>

            <span className="mb-[-3px]">·</span>
            <span title={formatedDate}>{formattedDate}</span>

            <span className="flex justify-end flex-1 ">
              {!isDeleting && (
                <div className="dropdown  ">
                  <div tabIndex={0} role="button" className="m-1">
                    <HiDotsHorizontal className="w-5 h-5" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-black"
                  >
                    <li className="font-bold flex ">
                      {isMyPost && !post.isCopyrighted && (
                        <a className="  " onClick={deletePostMutation}>
                          {" "}
                          <FaTrash /> Delete Post
                        </a>
                      )}
                      {isMod && !isMyPost && (
                        <a className="  " onClick={deletePostMutation}>
                          {" "}
                          <FaTrash /> Mod Delete
                        </a>
                      )}
                      {isMod && post.img && (
                        <a
                          className="  "
                          onClick={() => {
                            CopyrightPost();
                          }}
                        >
                          {" "}
                          <FaCopyright className="w-4 h-4" /> Copyright Content
                        </a>
                      )}
                      <a
                        onClick={() =>
                          toast.error("Report Post Feature coming soon")
                        }
                      >
                        {" "}
                        <MdReport className="w-4 h-4" /> Report Post
                      </a>
                      <a
                        className=""
                        onClick={() => {
                          toast.error("Hiding Post Feature coming soon");
                        }}
                      >
                        {" "}
                        <FaSadTear className="w-4 h-4" /> Hide Post
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              {isDeleting && <LoadingSpinner size="sm" />}
            </span>
          </div>
          <div
            className="flex flex-col gap-3 overflow-hidden   "
            // onClick={() => navigate(`/post/${post._id}`)}
          >
            {!post.isCopyrighted && <p>{renderText(post.text)}</p>}
            {post.isCopyrighted && (
              <div
                className="h-[500px] object-cover rounded-lg bg-primary bg-opacity-20 border border-gray-700 cursor-not-allowed flex justify-center items-center select-none"
                title="Copyrighted Content"
                disabled
              >
                <p className="font-bold">Copyrighted Content</p>
              </div>
            )}

            {post.img && !post.isCopyrighted && (
              <img
                src={post.img}
                className="h-[500px] object-cover rounded-lg border border-gray-700 cursor-pointer   "
                alt=""
              />
            )}
          </div>
          {!post.isCopyrighted && (
            <div className="flex justify-between mt-3">
              <div className="flex gap-4 items-center w-2/3 justify-between">
                <div
                  className="flex gap-1 items-center cursor-pointer group"
                  onClick={() =>
                    document
                      .getElementById("comments_modal" + post._id)
                      .showModal()
                  }
                >
                  <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                  <span className="text-sm text-slate-500 group-hover:text-sky-400">
                    {post.comments.length}
                  </span>
                </div>

                <dialog
                  id={`comments_modal${post._id}`}
                  className="modal border-none outline-none "
                >
                  <div className="modal-box rounded border border-gray-600 ">
                    <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                    <div
                      ref={containerRef}
                      className="flex flex-col gap-3 max-h-60 overflow-auto p-2  "
                    >
                      {post.comments.length === 0 && (
                        <p className="text-sm text-slate-500">
                          Be the first to comment for {postOwner.username} 🤍
                        </p>
                      )}

                      {post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex gap-2 items-start"
                        >
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img
                                src={
                                  comment.user.profileImg ||
                                  "/avatar-placeholder.png"
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="font-bold ">
                                {comment.user.fullname}
                              </span>
                              {comment.user.isVerified && (
                                <span className="flex flex-row gap-1">
                                  <MdVerified
                                    className="text-blue-500"
                                    title="Verified Member"
                                  />
                                  <FaSquareXTwitter title="Lwitter Mod" />
                                </span>
                              )}
                              <span className=" text-sm">
                                @{comment.user.username}
                              </span>

                              <span className=" text-sm">
                                · {formatPostDate(comment.createdAt)}
                              </span>
                            </div>
                            <div className="text-sm">{comment.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form
                      className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2 "
                      onSubmit={handlePostComment}
                    >
                      <textarea
                        className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800 "
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                      />
                      <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                        {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                      </button>
                    </form>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button className="outline-none">close</button>
                  </form>
                </dialog>
                <div className="flex gap-1 items-center group cursor-pointer">
                  <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                  <span className="text-sm text-slate-500 group-hover:text-green-500">
                    0
                  </span>
                </div>
                <div
                  className="flex gap-1 items-center group cursor-pointer"
                  onClick={handleLikePost}
                >
                  {!isLiked && (
                    <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500 select-none" />
                  )}
                  {isLiked && (
                    <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 select-none " />
                  )}

                  <span
                    className={`text-sm text-pink-500 group-hover:text-pink-500 select-none ${
                      isLiked ? "text-pink-500" : "text-slate-500"
                    }`}
                  >
                    {post.likes.length}
                  </span>
                </div>
              </div>
              <div className="flex w-1/3 justify-end gap-2 items-center">
                <div
                  className="flex gap-1 items-center group cursor-pointer"
                  onClick={handleBookmarkPost}
                >
                  {!isBookmarked && (
                    <FaRegBookmark className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-blue-500 select-none" />
                  )}
                  {isBookmarked && (
                    <FaRegBookmark className="w-4 h-4 cursor-pointer text-blue-500 select-none " />
                  )}
                  <span
                    className={`text-sm text-blue-500 group-hover:text-blue-500 select-none ${
                      isBookmarked ? "text-blue-500" : "text-slate-500"
                    }`}
                  >
                    {post.bookmarks.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
