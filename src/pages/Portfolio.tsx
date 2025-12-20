import PortfolioGicValuationDataComponent from "../components/portfolio/PortfolioGicValuationDataComponent.tsx";
import PortfolioNetWorthComponent from "../components/portfolio/PortfolioNetWorthComponent.tsx";
import PortfolioNetMarketValuationPlotDataComponent
  from "../components/portfolio/PortfolioNetMarketValuationPlotDataComponent.tsx";
import PortfolioMarketAccountValuationDataComponent
  from "../components/portfolio/PortfolioMarketAccountValuationDataComponent.tsx";
import PortfolioMarketAccountDividendsValuationDataComponent
  from "../components/portfolio/PortfolioMarketAccountDividendsValuationDataComponent.tsx";
import PortfolioMarketAccountValuationSectorPieChartComponent
  from "../components/portfolio/PortfolioMarketAccountValuationSectorPieChartComponent.tsx";
import PortfolioMarketSectorImntBreakdownComponent
  from "../components/portfolio/PortfolioMarketSectorImntBreakdownComponent.tsx";
import PortfolioMarketPerformersComponent from "../components/portfolio/PortfolioMarketPerformersComponent.tsx";
import PortfolioMarketInstrumentValuationComponent
  from "../components/portfolio/PortfolioMarketInstrumentValuationComponent.tsx";
import PortfolioMarketInstrumentDivSectorInfoComponent
  from "../components/portfolio/PortfolioMarketInstrumentDivSectorInfoComponent.tsx";
import PortfolioAggrMarketValuationDataComponent
  from "../components/portfolio/PortfolioAggrMarketValuationDataComponent.tsx";
import PortfolioSectionNetOverview from "../components/portfolio/PortfolioSectionNetOverviewComponent.tsx";
import GicAggregatorComponent from "../components/gic/GicAggregatorComponent.tsx";
import PortfolioHeatmapComponent from "../components/portfolio/PortfolioHeatmapComponent.tsx";


const Portfolio = () => {
  return (
    <div className={'row'}>
      <h1 className="market-breakdown-title">PORTFOLIO</h1>
      <div className={'row'}>
        <div className={'record-space-around'}>
          {<PortfolioNetWorthComponent/>}
          {/*{<PortfolioGicListingsComponent/>}*/}
          {<GicAggregatorComponent/>}
        </div>
        {<PortfolioGicValuationDataComponent/>}
        {/*{<PortfolioHeatmapComponent/>}*/}
        <h2 className="market-breakdown-title">Market</h2>
        {<PortfolioSectionNetOverview accountType={''} useDividends={true}/>}
        {<PortfolioNetMarketValuationPlotDataComponent/>}
        {<PortfolioAggrMarketValuationDataComponent/>}
        {<PortfolioMarketInstrumentDivSectorInfoComponent/>}
        {<PortfolioMarketInstrumentValuationComponent/>}
        <div>
          <h2 className="account-section-heading">TFSA</h2>
          {<PortfolioSectionNetOverview accountType={'TFSA'} useDividends={true}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'TFSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'TFSA'}/>}
          </div>
          {<PortfolioMarketPerformersComponent accountType={'TFSA'}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'TFSA'}/>}
          {<PortfolioHeatmapComponent accountType={"TFSA"}/>}
        </div>
        <div>
          <h2 className="account-section-heading">NR</h2>
          {<PortfolioSectionNetOverview accountType={'NR'} useDividends={true}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'NR'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'NR'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'NR'}/>}
          </div>
          {<PortfolioMarketPerformersComponent accountType={'NR'}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'NR'}/>}
          {<PortfolioHeatmapComponent accountType={"NR"}/>}
        </div>
        <div>
          <h2 className="account-section-heading">FHSA</h2>
          {<PortfolioSectionNetOverview accountType={'FHSA'} useDividends={true}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'FHSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'FHSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'FHSA'}/>}
          </div>
          {<PortfolioMarketPerformersComponent accountType={'FHSA'}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'FHSA'}/>}
          {<PortfolioHeatmapComponent accountType={"FHSA"}/>}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;