import {useEffect, useState} from 'react';
import './PortfolioSectionNetOverviewMetrics.css';
import {Utils} from "../../utils/Utils.tsx";
import {
  fetchAccountNetMarketValuationOverviewMetricData,
  fetchNetMarketValuationOverviewMetricData
} from "../../services/MarketPortfolioService.tsx";
import {DataPacket} from "../../assets/proto/generated/DataPacket.ts";
import PortfolioSectionNetOverviewMetrics from "./PortfolioSectionNetOverviewMetricsComponent.tsx";

const KEY_TOTAL_IMNTS = "totalInstruments";
const KEY_TOTAL_DIV = "totalDiv";
const KEY_PNL = "pnl";
const KEY_CURRENT_VAL = "currentVal";
const KEY_BOOK_VAL = "bookVal";
const KEY_QTY = "qty";
const KEY_WBETA = "beta-weighted";
const KEY_EXPECTED_YIELD = "expectedDivYieldPercent";
const KEY_EXPECTED_RETURN = "expectedReturnPercent";

const PortfolioSectionNetOverview = (props: { accountType: string, useDividends: boolean }) => {

  const [totalImnts, setTotalImnts] = useState<number>(0);
  const [bookVal, setBookVal] = useState<number>(0.00);
  const [currentVal, setCurrentVal] = useState<number>(0.00);
  const [pnl, setPnl] = useState<number>(0.00);
  const [pnlPct, setPnlPct] = useState<number>(0.0);
  const [totalDiv, setTotalDiv] = useState<number>(0.00);
  const [qty, setQty] = useState<number>(0.00);
  const [wbeta, setWBeta] = useState<number>(-Infinity);
  const [epr, setEpr] = useState<number>(0.0);
  const [epy, setEpy] = useState<number>(0.0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const result =
        props.accountType.length > 0
          ? await fetchAccountNetMarketValuationOverviewMetricData(props.accountType, props.useDividends)
          : await fetchNetMarketValuationOverviewMetricData(props.useDividends);

      if (!result) {
        throw new Error('No net market valuation overview metric information data received.');
      }

      const binaryData = new Uint8Array(result);
      const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);
      const metricValueMap = dataPacket.stringDoubleMap;

      if (!metricValueMap || metricValueMap.size === 0) {
        throw new Error('Empty maps received. No net market valuation metric info data available.');
      }

      if (metricValueMap.has(KEY_TOTAL_IMNTS)) setTotalImnts(Math.floor(metricValueMap.get(KEY_TOTAL_IMNTS) as number));
      if (metricValueMap.has(KEY_BOOK_VAL)) setBookVal(metricValueMap.get(KEY_BOOK_VAL) as number);
      if (metricValueMap.has(KEY_PNL)) {
        setPnl(metricValueMap.get(KEY_PNL) as number);
        setPnlPct(Utils.getPercentageWithoutSign(metricValueMap.get(KEY_PNL), metricValueMap.get(KEY_BOOK_VAL)));
      }
      setCurrentVal(metricValueMap.get(KEY_CURRENT_VAL) as number);
      setTotalDiv(metricValueMap.get(KEY_TOTAL_DIV) || 0.0);
      setQty(metricValueMap.get(KEY_QTY) || 0.0);
      setWBeta(metricValueMap.get(KEY_WBETA) || -Infinity);
      setEpr(Utils.yValueFormatAsNumber(metricValueMap.get(KEY_EXPECTED_RETURN) || 0.0));
      setEpy(Utils.yValueFormatAsNumber(metricValueMap.get(KEY_EXPECTED_YIELD) || 0.0));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PortfolioSectionNetOverviewMetrics data={{
      totalInstruments: totalImnts,
      bookVal: bookVal,
      currentVal: currentVal,
      pnlPct: pnlPct,
      pnl: pnl,
      totalDiv: totalDiv,
      qty: qty,
      wbeta: wbeta,
      epr: epr,
      epy: epy
    }}/>
  );
};

export default PortfolioSectionNetOverview;
