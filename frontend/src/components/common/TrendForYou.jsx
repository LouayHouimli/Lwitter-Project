import { MdVerified } from "react-icons/md";

const TrendForYou = () => {
  // Hardcoded array of trends
    const trends = [
      {
        category: "Sports",
        name: "Real Madrid",
        posts: "5.4K posts",
      },
      {
        category: "Technology",
        name: "AI Revolution",
        posts: "12.3K posts",
      },
      {
        category: "Health",
        name: "Mental Health Awareness",
        posts: "8.7K posts",
      },
      {
        category: "Sports",
        name: "World Cup 2024",
        posts: "15.2K posts",
      },
      {
        category: "Entertainment",
        name: "Top Gun 2",
        posts: "5.4K posts",
      },
    ];

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="p-4 rounded-md sticky top-2 border-2 border-black">
        <p className="font-bold mb-3 text-xl">Trends for you</p>
        <div className="flex flex-col gap-4">
          {trends.map((trend, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500">
                {trend.category} · Trending
                </span>
                <span className="font-semibold tracking-tight truncate w-full space">
                  <p className="flex items-center gap-2">{trend.name}</p>
                </span>
                <span className="text-sm text-slate-500">{trend.posts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendForYou;
