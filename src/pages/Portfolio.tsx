import PortfolioGicListingsComponent from "../components/portfolio/PortfolioGicListingsComponent.tsx";
import PortfolioGicValuationDataComponent from "../components/portfolio/PortfolioGicValuationDataComponent.tsx";
import PortfolioNetWorthComponent from "../components/portfolio/PortfolioNetWorthComponent.tsx";
import PortfolioNetMarketValuationDataComponent from "../components/portfolio/PortfolioNetMarketValuationDataComponent.tsx";
import PortfolioMarketAccountValuationDataComponent from "../components/portfolio/PortfolioMarketAccountValuationDataComponent.tsx";
import PortfolioMarketAccountDividendsValuationDataComponent from "../components/portfolio/PortfolioMarketAccountDividendsValuationDataComponent.tsx";
import PortfolioMarketAccountValuationSectorPieChartComponent
  from "../components/portfolio/PortfolioMarketAccountValuationSectorPieChartComponent.tsx";
import PortfolioMarketSectorImntBreakdownComponent from "../components/portfolio/PortfolioMarketSectorImntBreakdownComponent.tsx";


const Portfolio = () => {
  return (
    <div className={'row'}>
      <h1 className="market-breakdown-title">PORTFOLIO</h1>
      <div className={'row'}>
        <div className={'record-space-around'}>
          {<PortfolioNetWorthComponent/>}
          {<PortfolioGicListingsComponent/>}
        </div>
        {<PortfolioGicValuationDataComponent/>}
        <h2 className="market-breakdown-title">Market</h2>
        {<PortfolioNetMarketValuationDataComponent/>}
        <div>
          <h2 className="account-section-heading">TFSA</h2>
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'TFSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'TFSA'}/>}
          </div>
          {<PortfolioMarketAccountValuationDataComponent accountType={'TFSA'}/>}
        </div>
        <div>
          <h2 className="account-section-heading">NR</h2>
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'NR'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'NR'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'NR'}/>}
          </div>
          {<PortfolioMarketAccountValuationDataComponent accountType={'NR'}/>}
        </div>
        <div>
          <h2 className="account-section-heading">FHSA</h2>
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'FHSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'FHSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'FHSA'}/>}
          </div>
          {<PortfolioMarketAccountValuationDataComponent accountType={'FHSA'}/>}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;