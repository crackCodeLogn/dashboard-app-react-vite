import {useEffect, useState} from "react";
import {fetchAccountMarketDividendValuationsData} from "../../services/MarketPortfolioService.tsx";
import {DataPacket} from "../../assets/proto/generated/DataPacket.ts";
import {Utils} from "../../utils/Utils.tsx";
import CustomError from "../error/CustomError.tsx";
import Table from "react-bootstrap/Table";

export interface MarketDividendValuation {
  symbol: string,
  value: number
}

const PortfolioMarketAccountValuationDataComponent = (props: { accountType: string; limit: number }) => {
  const accountType: string = props.accountType;
  const limit: number = props.limit;
  const [marketDividendValuationData, setMarketDividendValuationData] = useState<MarketDividendValuation[] | null>(null);
  const [totalValue, setTotalValue] = useState(0.0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchAccountMarketDividendValuationsData(accountType)
      .then(result => {
        if (!result) {
          throw new Error(`no market div valuation data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);
        const marketDividendValuations: MarketDividendValuation[] = [];
        let totalValue = 0.0;
        for (const entry of dataPacket.stringDoubleMap.entries()) {
          // console.log(entry);
          marketDividendValuations.push({symbol: entry[0], value: entry[1]})
          totalValue += entry[1];
        }
        setTotalValue(totalValue);
        marketDividendValuations.sort((a, b) => b.value - a.value);
        setMarketDividendValuationData(marketDividendValuations.slice(0, Math.min(marketDividendValuations.length, limit - 1)));
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  return (
    <>
      {marketDividendValuationData
        ?
        <div className={'centralize-2'}>
          <h2>Dividends</h2>
          <Table bordered hover variant={'light'} className={"table-narrow"}>
            <thead>
            <tr>
              <th>Symbol</th>
              <th>All Time</th>
              <th>Allocation</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td className={'color-investment cell-strong'}>TOTAL</td>
              <td className={'color-investment cell-strong'}>{Utils.formatDollar(totalValue)}</td>
              <td className={'color-investment cell-strong'}>100%</td>
            </tr>
            {marketDividendValuationData.map((valuation) => (
              <tr key={valuation.symbol}>
                <td>{valuation.symbol}</td>
                <td>{Utils.formatDollar(valuation.value)}</td>
                <td>{Utils.getPercentage(valuation.value, totalValue)}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
        : <CustomError errorMsg={!errorMsg ? 'No Market Dividend valuation data fetched' : errorMsg}/>}
    </>
  )
}

export default PortfolioMarketAccountValuationDataComponent;