import { useState } from "react";

import Posts from "../../components/common/Posts";
import { useQueryClient } from "@tanstack/react-query";

const Bookmark = () => {
  const [feedType, setFeedType] = useState("bookmarks");
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Bookmarks</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a >Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {/*  CREATE POST INPUT */}

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default Bookmark;
