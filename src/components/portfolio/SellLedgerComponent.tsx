import {useEffect, useState} from "react";
import {fetchSellPnl} from "../../services/MarketPortfolioService.tsx";
import {Instrument, Portfolio} from "../../assets/proto/generated/MarketData.ts";
import SellLedger, {SellRecord} from "./SellLedger.tsx";

const parseSellRecords = (imnts: Instrument[]) => {
  const records: SellRecord[] = [];
  for (const imnt of imnts) {
    records.push({
      symbol: imnt.ticker.symbol,
      date: imnt.ticker.data[0].date,
      accountType: imnt.accountType,
      quantity: imnt.qty,
      pnL: imnt.ticker.data[1].price,
      pricePerShare: imnt.ticker.data[2].price,
      preAcbTotal: Number.parseFloat(imnt.metaData.get('pre-acb-total') || '0.0'),
      preAcbUnit: Number.parseFloat(imnt.metaData.get('pre-acb-unit') || '0.0'),
      soldPrice: imnt.ticker.data[0].price,
      currentAcbTotal: Number.parseFloat(imnt.metaData.get('cur-acb-total') || '0.0'),
      currentAcbUnit: Number.parseFloat(imnt.metaData.get('cur-acb-unit') || '0.0'),
      closingPosition: imnt.metaData.get('closing')?.toLowerCase() === 'true',
    });
  }
  return records;
}

const SellLedgerComponent = (props: { accountType: string }) => {
  const {accountType} = props;
  const [sellRecords, setSellRecords] = useState<SellRecord[]>([]);

  useEffect(() => {
    fetchSellPnl(accountType)
      .then(result => {
        if (!result) {
          throw new Error(`no sell record data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);
        setSellRecords(parseSellRecords(portfolio.instruments));
      })
      .catch(err => {
        console.error(err);
        // setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  return (
    <>
      {<SellLedger dataPoints={sellRecords}/>}
    </>
  )
}

export default SellLedgerComponent;