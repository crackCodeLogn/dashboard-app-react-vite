import PortfolioGicListingsComponent from "../components/portfolio/PortfolioGicListingsComponent.tsx";
import PortfolioGicValuationDataComponent from "../components/portfolio/PortfolioGicValuationDataComponent.tsx";
import PortfolioNetWorthComponent from "../components/portfolio/PortfolioNetWorthComponent.tsx";
import PortfolioNetMarketValuationDataComponent from "../components/portfolio/PortfolioNetMarketValuationDataComponent.tsx";
import PortfolioMarketAccountValuationDataComponent from "../components/portfolio/PortfolioMarketAccountValuationDataComponent.tsx";
import PortfolioMarketAccountDividendsValuationDataComponent from "../components/portfolio/PortfolioMarketAccountDividendsValuationDataComponent.tsx";
import PortfolioMarketAccountValuationSectorPieChartComponent
  from "../components/portfolio/PortfolioMarketAccountValuationSectorPieChartComponent.tsx";


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
        <div className={'record-space-around'}>
          {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'TFSA'} limit={16}/>}
          {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
        </div>
        <div className={'record-space-around'}>
          {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'NR'} limit={16}/>}
          {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'NR'} limit={5}/>}
        </div>
        <div className={'record-space-around'}>
          {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'FHSA'} limit={16}/>}
          {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'FHSA'} limit={5}/>}
        </div>
        {/*<div className={'record-space-around'}>*/}
        {/*</div>*/}
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