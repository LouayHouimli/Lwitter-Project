import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQueryClient } from "@tanstack/react-query";

const HomePage = () => {
  document.title = "Home / X";
  const [feedType, setFeedType] = useState("forYou");
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className={
              "flex justify-center flex-1 p-3  cursor-pointer relative select-none"
            }
            onClick={() => setFeedType("forYou")}
            onDoubleClick={() =>
              queryClient.invalidateQueries({ queryKey: ["posts"] })
            }
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 cursor-pointer relative select-none"
            onClick={() => setFeedType("following")}
            onDoubleClick={() =>
              queryClient.invalidateQueries({ queryKey: ["posts"] })
            }
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default HomePage;
