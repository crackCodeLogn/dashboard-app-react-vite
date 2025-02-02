import MarketDataAdhocComponent from "../components/market/adhoc/MarketDataAdhocComponent.tsx";

const MarketDataAdhoc = () => {
  return (
    <div>
      <h1>Market Adhoc Inquiry</h1>
      <hr/>
      <MarketDataAdhocComponent showTable={true}/>
    </div>
  )
}

export default MarketDataAdhoc;