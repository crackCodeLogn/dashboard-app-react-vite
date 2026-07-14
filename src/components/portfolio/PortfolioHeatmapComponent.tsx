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

  // Interactive toggle states
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

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

      const binaryData = new Uint8Array(result);
      const correlationMatrix: CorrelationMatrix = CorrelationMatrix.deserializeBinary(binaryData);
      setCorrelationEntries(parseCorrelationEntries(correlationMatrix));
      setHasLoadedOnce(true);

    } catch (err) {
      console.error(err);
      setErrorMsg(`Error fetching correlation matrix data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [accountType]);

  // Lazy execution: Trigger data fetch only when the drawer is initially opened
  useEffect(() => {
    if (isExpanded && !hasLoadedOnce) {
      fetchData();
    }
  }, [isExpanded, hasLoadedOnce, fetchData]);

  return (
    <div className="centerLine heatmap-collapsible-wrapper">
      {/* Interactive Accordion Trigger Header */}
      <div
        className={`heatmap-trigger-bar ${isExpanded ? 'active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="trigger-title-group">
          <span className="trigger-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="trigger-title">{accountType} Correlation Matrix Matrix Heatmap</span>
        </div>
        <span className="trigger-badge">
          {isExpanded ? 'Click to Collapse' : 'Click to Expand'}
        </span>
      </div>

      {/* Content Body Container */}
      <div className={`heatmap-content-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {isExpanded && (
          <div className="heatmap-render-container">
            {errorMsg ? (
              <CustomError errorMsg={errorMsg}/>
            ) : !hasLoadedOnce ? (
              <div className="heatmap-loading-placeholder">Loading matrix telemetry channels...</div>
            ) : (
              <CorrelationHeatmap title={accountType} data={correlationEntries} cellSizePx={cellSizePx}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioHeatmapComponent;