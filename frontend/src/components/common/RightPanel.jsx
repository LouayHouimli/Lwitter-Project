import SuggestedPanel from "./SuggestedPanel";
import Subscribe from "./Subscribe";
import TrendForYou from "./TrendForYou";

const RightPanel = () => {
  return (
    <div className="hidden lg:flex lg:flex-col space-y-2 gap-3 ml-2 mt-1"> {/* Added 'hidden lg:flex' classes */}
      <Subscribe />
      <TrendForYou />
      <SuggestedPanel />
    </div>
  );
};

export default RightPanel;
