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
        <h2 className="market-breakdown-title">Market</h2>
        {<PortfolioSectionNetOverview accountType={''} useDividends={true}/>}
        {<PortfolioNetMarketValuationPlotDataComponent/>}
        {<PortfolioAggrMarketValuationDataComponent/>}
        {<PortfolioHeatmapComponent accountType={'PORTFOLIO'} cellSizePx={40}/>}

        {<PortfolioMarketInstrumentDivSectorInfoComponent/>}
        {<PortfolioMarketInstrumentValuationComponent/>}
        <div>
          <h2 className="account-section-heading">TFSA</h2>
          {<PortfolioSectionNetOverview accountType={'TFSA'} useDividends={true}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'TFSA'}/>}
          {<PortfolioMarketPerformersComponent accountType={'TFSA'}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'TFSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'TFSA'}/>}
          </div>
          {<PortfolioHeatmapComponent accountType={"TFSA"} cellSizePx={55}/>}
        </div>
        <div>
          <h2 className="account-section-heading">NR</h2>
          {<PortfolioSectionNetOverview accountType={'NR'} useDividends={true}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'NR'}/>}
          {<PortfolioMarketPerformersComponent accountType={'NR'}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'NR'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'NR'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'NR'}/>}
          </div>
          {<PortfolioHeatmapComponent accountType={"NR"} cellSizePx={51}/>}
        </div>
        <div>
          <h2 className="account-section-heading">FHSA</h2>
          {<PortfolioSectionNetOverview accountType={'FHSA'} useDividends={true}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'FHSA'}/>}
          {<PortfolioMarketPerformersComponent accountType={'FHSA'}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'FHSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'FHSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'FHSA'}/>}
          </div>
          {<PortfolioHeatmapComponent accountType={"FHSA"} cellSizePx={75}/>}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;