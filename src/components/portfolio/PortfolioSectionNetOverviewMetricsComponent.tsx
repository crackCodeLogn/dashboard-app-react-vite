import React from 'react';
import './PortfolioSectionNetOverviewMetrics.css';
import {Utils} from "../../utils/Utils.tsx";

// 1. Define the TypeScript Interface
interface PortfolioData {
  totalInstruments: number;
  bookVal: number;
  currentVal: number;
  pnlPct: string;
  pnl: number;
  totalDiv: number;
  qty: number;
  wbeta: number;
}

// 3. The Core Component
const PortfolioSectionNetOverviewMetrics: React.FC<{ data: PortfolioData }> = ({data}) => {
  const {totalInstruments, bookVal, currentVal, pnlPct, pnl, totalDiv, qty, wbeta} = data;

  // PnL color class determination
  const pnlColorClass: string = pnl >= 0 ? 'pnl-positive' : 'pnl-negative';

  // Helper function to render an individual metric block
  const renderMetric = (label: string, value: string, isPnl: boolean = false, isCurrency: boolean = true) => (
    <div className={`metric-block ${isPnl ? pnlColorClass : ''} ${isCurrency ? 'is-currency' : 'is-count'}`}>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );

  return (
    <div style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
      <div className="portfolio-metrics-container">
        {/* 1. Current Value (Often the most prominent) */}
        {renderMetric('Current Value', Utils.formatDollar(currentVal), false, true)}

        {/* 2. PnL % */}
        {renderMetric('PnL %', pnlPct, true, false)}

        {/* 3. PnL (Monetary) */}
        {renderMetric('PnL', Utils.formatDollar(pnl), true, true)}

        {/* 4. Book Value */}
        {renderMetric('Book Value', Utils.formatDollar(bookVal), false, true)}

        {/* 5. Total Instruments */}
        {renderMetric('Instruments', totalInstruments.toLocaleString(), false, false)}

        {/* 6. Total Quantity */}
        {renderMetric('Quantity', Utils.yValueFormat(qty), false, false)}

        {/* 7. Total Dividends */}
        {renderMetric('Dividends', Utils.formatDollar(totalDiv), false, true)}
      </div>
      <div className="portfolio-metrics-container">
        {renderMetric('Beta', Utils.yValueFormat(wbeta), false, false)}
      </div>
    </div>
  );
};

export default PortfolioSectionNetOverviewMetrics;
