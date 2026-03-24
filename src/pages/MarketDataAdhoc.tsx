import MarketDataAdhocComponent from "../components/market/adhoc/MarketDataAdhocComponent.tsx";
import PortfolioMarketInstrumentValuationComponent
  from "../components/market/adhoc/PortfolioMarketInstrumentValuationComponent.tsx";
import {useEffect} from "react";
import CorrelationAdhocComponent from "../components/market/adhoc/CorrelationAdhocComponent.tsx";

const MarketDataAdhoc = () => {
  useEffect(() => {
    document.title = 'V2K Adhoc';
  }, []);

  return (
    <div>
      <h1>Market Adhoc Inquiry</h1>
      <hr/>
      <MarketDataAdhocComponent showTable={true}/>
      {<PortfolioMarketInstrumentValuationComponent/>}
      <hr/>
      {<CorrelationAdhocComponent cellSizePx={40}/>}
    </div>
  )
}

export default MarketDataAdhoc;