import { useState } from "react";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom"


const Explore = () => {
    const [search, setSearch] = useState("")
    const [disable, setDisabled] = useState(false)
    const searchField = useParams().search
    
    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        console.log(search)
    }
  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 gap-3">
          <div className="w-full">
            <label className="input input-bordered rounded-full flex items-center  gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-5 w-5 opacity-70 bg flex  items-start"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="text"
                className="grow"
                defaultValue={searchField}
                disabled={disable}
                placeholder="Search"
                onClick={() => {
                  toast.error("Search feature coming soon..");
                  setDisabled(true);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
