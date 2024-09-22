import SuggestedPanel from "./SuggestedPanel";
import Subscribe from "./Subscribe";
import TrendForYou from "./TrendForYou";

const RightPanel = () => {
  return (
    <div className="flex flex-col space-y-2 gap-3 ml-2 mt-1"> {/* Reduced space between components */}
      <Subscribe />
      <TrendForYou />
      <SuggestedPanel />
    </div>
  );
};

export default RightPanel;
