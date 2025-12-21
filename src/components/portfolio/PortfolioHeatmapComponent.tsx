import {useCallback, useEffect, useState} from 'react';
import {
  fetchCorrelationMatrixForAccountType,
  fetchCorrelationMatrixForPortfolio,
  fetchCorrelationMatrixForSectors
} from '../../services/MarketPortfolioService.tsx';
import './PortfolioMarketPerformers.css';
import {CorrelationMatrix} from "../../assets/proto/generated/MarketData.ts";
import CorrelationHeatmap, {CorrelationEntry} from "../heatmap/CorrelationHeatmapComponent.tsx";
import CustomError from "../error/CustomError.tsx";


const PortfolioHeatmapComponent = (props: { accountType: string, cellSizePx: number }) => {
  const {accountType, cellSizePx} = props;

  const [correlationEntries, setCorrelationEntries] = useState<CorrelationEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  function parseCorrelationEntries(correlationMatrix: CorrelationMatrix): CorrelationEntry[] {
    const correlationEntries: CorrelationEntry[] = [];
    if (correlationMatrix != null) {
      correlationMatrix.entries.map(v => {
        correlationEntries.push({
          instrument1: v.imntRow,
          instrument2: v.imntCol,
          value: v.value
        })
      });
    }
    return correlationEntries;
  }

  const fetchData = useCallback(async () => {
    setErrorMsg('');
    setCorrelationEntries([]);
    try {
      const result = await (accountType === 'PORTFOLIO'
        ? fetchCorrelationMatrixForPortfolio()
        : (accountType === 'SECTOR'
          ? fetchCorrelationMatrixForSectors()
          : fetchCorrelationMatrixForAccountType(accountType)));

      if (!result) {
        throw new Error(`No correlation matrix data found for ${accountType}`);
      }

      // 1. Protobuf Deserialization
      const binaryData = new Uint8Array(result);
      const correlationMatrix: CorrelationMatrix = CorrelationMatrix.deserializeBinary(binaryData);
      setCorrelationEntries(parseCorrelationEntries(correlationMatrix));

    } catch (err) {
      console.error(err);
      setErrorMsg(`Error fetching correlation matrix data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [accountType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={"centerLine"}>
      {errorMsg
        ? <CustomError errorMsg={errorMsg}/>
        : <CorrelationHeatmap data={correlationEntries} cellSizePx={cellSizePx}/>}
    </div>
  );
};

export default PortfolioHeatmapComponent;