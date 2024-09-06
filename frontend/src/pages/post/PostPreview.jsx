import Post from "../../components/common/Post";
import { useParams } from "react-router-dom";
import { useQuery,useQueryClient } from "@tanstack/react-query";

const PostPreview = () => {
  const { id: postId } = useParams();
  const queryClient = useQueryClient();
  

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post",postId],
    queryFn: async () => {
      const res = await fetch("/api/posts/post/" + postId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Post : {post.text}</p>
        
        <div/>
      </div>
        <Post post={post} />
    </div>
  );
};

export default PostPreview;
