import MarketDataAdhocComponent from "../components/market/adhoc/MarketDataAdhocComponent.tsx";
import PortfolioMarketInstrumentValuationComponent
  from "../components/market/adhoc/PortfolioMarketInstrumentValuationComponent.tsx";
import {useEffect} from "react";

const MarketDataAdhoc = () => {
  useEffect(() => {
    document.title = 'V2K Adhoc';
  }, []);

  return (
    <div>
      <h1>Market Adhoc Inquiry</h1>
      <hr/>
      {<PortfolioMarketInstrumentValuationComponent/>}
      <hr/>
      <MarketDataAdhocComponent showTable={true}/>
    </div>
  )
}

export default MarketDataAdhoc;