import SuggestedPanel from "./SuggestedPanel";
import Subscribe from "./Subscribe";
import TrendForYou from "./TrendForYou";


const RightPanel = () => {
  

  return (
    <>
      <div className="flex flex-col">
        <Subscribe />
        <TrendForYou />
        <SuggestedPanel />
      </div>
    </>
  );
};
export default RightPanel;
