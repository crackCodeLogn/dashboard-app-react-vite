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
import PortfolioAggrMarketValuationDataComponent
  from "../components/portfolio/PortfolioAggrMarketValuationDataComponent.tsx";
import PortfolioSectionNetOverview from "../components/portfolio/PortfolioSectionNetOverviewComponent.tsx";
import GicAggregatorComponent from "../components/gic/GicAggregatorComponent.tsx";
import PortfolioHeatmapComponent from "../components/portfolio/PortfolioHeatmapComponent.tsx";
import PortfolioNewsCorpActionsComponent from "../components/portfolio/PortfolioNewsCorpActionsComponent.tsx";
import {useEffect, useState} from "react";
import {performRefresh} from "../services/MarketPortfolioService.tsx";
import PortfolioHeadingAtAGlance from "../components/portfolio/PortfolioHeadingAtAGlance.tsx";
import SellLedgerComponent from "../components/portfolio/SellLedgerComponent.tsx";


const Portfolio = () => {
  const [hardRefreshInProgress, setHardRefreshInProgress] = useState(false);
  const [softRefreshInProgress, setSoftRefreshInProgress] = useState(false);

  useEffect(() => {
    document.title = 'V2K Portfolio';
  }, []);

  const refreshSoft = () => {
    return refresh(false);
  }
  const refreshHard = () => {
    return refresh(true);
  }
  const refresh = async (hard = false) => {
    if (hardRefreshInProgress || softRefreshInProgress) {
      alert("Cannot trigger another refresh whilst former is ongoing...");
      return;
    }

    let refreshType: string = 'Hard';
    try {
      if (hard) {
        setHardRefreshInProgress(true);
      } else {
        setSoftRefreshInProgress(true);
        refreshType = 'Soft';
      }
      await performRefresh(hard);
      console.log(`${refreshType} refresh completed`);

      alert(`${refreshType} refresh complete, gonna reload the page now`);
    } catch (e) {
      console.log(`Failed to wait for ${refreshType} refresh completion`, e);
    } finally {
      setHardRefreshInProgress(false);
      setSoftRefreshInProgress(false);
    }

    window.location.reload();
  }

  const getRefreshMessage = () => {
    if (hardRefreshInProgress || softRefreshInProgress)
      return ` [${hardRefreshInProgress ? "hard" : "soft"} refreshing...]`;
    return "";
  }

  return (
    <div className={'row'}>
      <header className="workshop-header">
        <div className="brand">
          <h1>PORTFOLIO{getRefreshMessage()}</h1>
        </div>
        <div>
          <button className="btn-add gap-around" onClick={refreshHard}>HARD REFRESH</button>
          <button className="btn-add gap-around" onClick={refreshSoft}>SOFT REFRESH</button>
        </div>
      </header>
      <div className={'row'}>
        <div className={'record-space-around'}>
          {<PortfolioNetWorthComponent/>}
          {/*{<PortfolioGicListingsComponent/>}*/}
          {<GicAggregatorComponent/>}
        </div>
        {<PortfolioGicValuationDataComponent/>}
        <h2 className="market-breakdown-title">Market</h2>
        {<PortfolioSectionNetOverview accountType={''} useDividends={true}/>}
        {<PortfolioHeadingAtAGlance/>}
        {<PortfolioNetMarketValuationPlotDataComponent/>}
        {<PortfolioAggrMarketValuationDataComponent/>}
        {<SellLedgerComponent accountType={''}/>}

        {<PortfolioNewsCorpActionsComponent/>}
        {<PortfolioHeatmapComponent accountType={'SECTOR'} cellSizePx={65}/>}
        {<PortfolioHeatmapComponent accountType={'PORTFOLIO'} cellSizePx={31}/>}

        <div>
          <h2 className="account-section-heading">TFSA</h2>
          {<PortfolioSectionNetOverview accountType={'TFSA'} useDividends={true}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'TFSA'}/>}
          {<SellLedgerComponent accountType={'TFSA'}/>}
          {<PortfolioMarketPerformersComponent accountType={'TFSA'}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'TFSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'TFSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'TFSA'}/>}
          </div>
          {<PortfolioHeatmapComponent accountType={"TFSA"} cellSizePx={35}/>}
        </div>
        <div>
          <h2 className="account-section-heading">NR</h2>
          {<PortfolioSectionNetOverview accountType={'NR'} useDividends={true}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'NR'}/>}
          {<SellLedgerComponent accountType={'NR'}/>}
          {<PortfolioMarketPerformersComponent accountType={'NR'}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'NR'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'NR'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'NR'}/>}
          </div>
          {<PortfolioHeatmapComponent accountType={"NR"} cellSizePx={35}/>}
        </div>
        <div>
          <h2 className="account-section-heading">FHSA</h2>
          {<PortfolioSectionNetOverview accountType={'FHSA'} useDividends={true}/>}
          {<PortfolioMarketAccountValuationDataComponent accountType={'FHSA'}/>}
          {<SellLedgerComponent accountType={'FHSA'}/>}
          {<PortfolioMarketPerformersComponent accountType={'FHSA'}/>}
          <div className={'record-space-around-3'}>
            {<PortfolioMarketAccountDividendsValuationDataComponent accountType={'FHSA'} limit={16}/>}
            {<PortfolioMarketAccountValuationSectorPieChartComponent accountType={'FHSA'} limit={5}/>}
            {<PortfolioMarketSectorImntBreakdownComponent accountType={'FHSA'}/>}
          </div>
          {<PortfolioHeatmapComponent accountType={"FHSA"} cellSizePx={55}/>}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
