import PortfolioGicListingsComponent from "../components/portfolio/PortfolioGicListingsComponent.tsx";
import PortfolioGicValuationDataComponent from "../components/portfolio/PortfolioGicValuationDataComponent.tsx";
import PortfolioNetWorthComponent from "../components/portfolio/PortfolioNetWorthComponent.tsx";
import PortfolioNetMarketValuationDataComponent
  from "../components/portfolio/PortfolioNetMarketValuationDataComponent.tsx";
import PortfolioMarketAccountValuationDataComponent
  from "../components/portfolio/PortfolioMarketAccountValuationDataComponent.tsx";


const Portfolio = () => {
  return (
    <div className={'row'}>
      <h1> Portfolio </h1>
      <hr/>
      <div className={'row'}>
        <div className={'record-space-around'}>
          {<PortfolioNetWorthComponent/>}
          {<PortfolioGicListingsComponent/>}
        </div>
        {<PortfolioGicValuationDataComponent/>}
        {<PortfolioNetMarketValuationDataComponent/>}
        {<PortfolioMarketAccountValuationDataComponent accountType={'TFSA'}/>}
        {<PortfolioMarketAccountValuationDataComponent accountType={'NR'}/>}
        {<PortfolioMarketAccountValuationDataComponent accountType={'FHSA'}/>}
      </div>
    </div>
  );
};

export default Portfolio;