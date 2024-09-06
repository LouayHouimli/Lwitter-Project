import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import Post from "../../components/common/Post";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const searchField = searchParams.get("q") || ""; // Get 'q' query parameter
  const [search, setSearch] = useState(searchField);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: searchedPosts,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["searchedPosts"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/posts/explore?q=${encodeURIComponent(search)}&src=typed_query`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!search, // Only fetch if search is not empty
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchPost = () => {
    if (search) {
      // Update the URL with the search query
      navigate(`/explore?q=${encodeURIComponent(search)}&src=typed_query`);
      refetch(); // Fetch the new results based on the updated search query
    }
  };



  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700 gap-3">
        <div className="w-full">
          <label className="input input-bordered rounded-full flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-5 w-5 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                searchPost();
                queryClient.invalidateQueries({ queryKey: ["searchedPosts"] });
              }}
            >
              <input
                type="text"
                className="grow"
                value={search}
                placeholder="Search"
                name="search"
                onChange={handleSearch}
              />
            </form>
          </label>
        </div>
      </div>
      <div>
        {isLoading || isRefetching ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : search == "" ? (
          <></>
        ) : searchedPosts.length == 0 ? (
          <p>Error no data</p>
        ) : (
          searchedPosts?.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Explore;
