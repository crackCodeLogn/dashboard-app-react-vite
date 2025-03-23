import {useEffect, useState} from "react";
import {fetchAccountMarketValuationsData} from "../../services/MarketPortfolioService.tsx";
import {DataPacket} from "../../assets/proto/generated/DataPacket.ts";
import {Utils} from "../../utils/Utils.tsx";
import CustomError from "../error/CustomError.tsx";
import MarketValuationDataComponent from "../market/portfolio/MarketValuationDataComponent.tsx";

export interface MarketValuation {
  date: string,
  value: number
}

const PortfolioMarketAccountValuationDataComponent = (props: { accountType: string; }) => {
  const accountType: string = props.accountType;
  const [marketValuationData, setMarketValuationData] = useState<MarketValuation[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchAccountMarketValuationsData(accountType)
      .then(result => {
        if (!result) {
          throw new Error(`no net market valuation data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);
        const marketValuations: MarketValuation[] = [];
        for (const entry of dataPacket.intDoubleMap.entries()) {
          // console.log(entry);
          marketValuations.push({date: Utils.getDateInString(entry[0]), value: entry[1]})
        }
        setMarketValuationData(marketValuations);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  return (
    <>
      {marketValuationData
        ?
        <MarketValuationDataComponent valuationData={marketValuationData}
                                      title={`Market ${accountType} Valuation - Profit / Loss`}/>
        : <CustomError errorMsg={!errorMsg ? 'No Net Market valuation data fetched' : errorMsg}/>}
    </>
  )
}

export default PortfolioMarketAccountValuationDataComponent;