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
        {<PortfolioGicValuationDataComponent/>}
        {<PortfolioNetMarketValuationDataComponent/>}
        <div>
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'TFSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
          </div>
          {<PortfolioMarketAccountValuationDataComponent accountType={'TFSA'}/>}
        </div>
        <div>
          <div className={'record-space-around'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'NR'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'NR'} limit={5}/>}
          </div>
          {<PortfolioMarketAccountValuationDataComponent accountType={'NR'}/>}
        </div>
        <div>
          <div className={'record-space-around'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'FHSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'FHSA'} limit={5}/>}
          </div>
          {<PortfolioMarketAccountValuationDataComponent accountType={'FHSA'}/>}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;