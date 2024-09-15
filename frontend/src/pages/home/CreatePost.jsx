import React, { useRef, useState, useEffect, Suspense } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Lazy load the Emoji Picker component
const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

const CreatePost = () => {
  const [text, setText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [img, setImg] = useState(null);
  const queryClient = useQueryClient();
  const imgRef = useRef(null);
  const emojiPickerRef = useRef(null); // Ref for the emoji picker

  // Fetching authenticated user data
  const { data } = useQuery({ queryKey: ["authUser"] });

  // Mutation for creating a post
  const {
    mutate: createPostMutation,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });

        const data = await res.json();
        if (data.error) {
          toast.error(data.message, { id: "create-post" });
        } else {
          toast.success("Post created successfully", { id: "create-post" });
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text && !img) {
      toast.error("Please provide text or image", { id: "create-post" });
      return;
    }

    createPostMutation({ text, img });
    setText("");
    setImg(null);
    setFormattedText("");
  };

  // Handle image file change
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle emoji picker click
  const handleEmojiClick = (emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
  };

  // Handle text input change and format mentions/hashtags
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);

    const formatted = inputText.replace(
      /(^|\s)([@#][a-zA-Z\d_]+)/g,
      '$1<span class="text-primary font-light">$2</span>'
    );
    setFormattedText(formatted);
  };

  // Click outside emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerVisible(false); // Hide the emoji picker
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={data?.profileImg || "/avatar-placeholder.png"}
            alt="avatar"
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800 placeholder-gray-500"
            placeholder="What is happening?!"
            value={text}
            spellCheck="false"
            onChange={handleTextChange}
          />
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none p-0 text-lg border-none focus:outline-none text-transparent"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        </div>
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
              alt="preview"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <div className="relative">
              <BsEmojiSmileFill
                className="fill-primary w-5 h-5 cursor-pointer"
                onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
              />

              {isEmojiPickerVisible && (
                <div
                  className="absolute z-10 top-full"
                  ref={emojiPickerRef} // Attach ref to the emoji picker
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
            accept="image/*"
          />
          <button className="btn btn-primary rounded-full btn-sm text-black px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
