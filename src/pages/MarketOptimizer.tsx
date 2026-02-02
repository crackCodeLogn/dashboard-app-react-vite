import {useEffect} from "react";
import StrategyPortfolioOptimizerDashboard
  from "../components/market/optimizer/StrategyPortfolioOptimizerDashboard.tsx";

const MarketOptimizer = () => {

  useEffect(() => {
    document.title = 'V2K Optimizer';
  }, []);

  return (
    <div>
      <StrategyPortfolioOptimizerDashboard/>
    </div>
  )
}

export default MarketOptimizer;