import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { MdVerified } from "react-icons/md";

const NotificationPage = () => {
  
  document.title = "Notifications / L";
  const queryClient = useQueryClient();
  const { data: notifications ,isLoading } = useQuery({ queryKey: ["notifications"] });

  const { mutate: deleteAllNotification, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications/deleteAll", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        if (data.message) {
          toast.error(data.message, { id: "deleteAllNotification" });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const deleteNotifications = () => {
    if (notifications?.length > 0) {
      deleteAllNotification();
    } else {
      toast.error("No notifications to delete", {
        id: "deleteAllNotification",
      });
      return;
    }
  };
  const getNotificationMessage = (type) => {
    switch (type) {
      case "follow":
        return "followed you";
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "mention":
        return "mentioned you in a post";
      default:
        return "sent you a notification";
    }
  };

  // Usage in component
  


  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading ||
          (isPending && (
            <div className="flex justify-center h-full items-center">
              <LoadingSpinner size="lg" />
            </div>
          ))}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-primary" />
              )}
              {notification.type === "comment" && (
                <FaComment className="w-7 h-7 text-primary" />
              )}
              {notification.type === "repost" && (
                <FaRetweet className="w-7 h-7 text-primary" />
              )}
              <Link to={`/profile/${notification.sender.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.sender.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1 justify-center items-center ">
                  
                  <span className="font-bold flex flex-row justify-center items-center gap-1">
                    
                    @{notification.sender.username}
                    {notification.sender.isVerified && <MdVerified className="text-blue-500"/>}
                  </span>{" "}
                  <span className="font-bold ">
                    {" "}
                    {getNotificationMessage(notification.type)}{" "}
                  </span>
                </div>
                <div className="font-bold flex ">
                  {notification?.content
                    ? "Comment : " + notification.content
                    : ""}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
