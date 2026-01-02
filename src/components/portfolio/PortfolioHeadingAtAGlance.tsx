import React, {useEffect, useState} from 'react';
import './PortfolioHeadingAtAGlance.css';
import {fetchHeadingAtAGlance} from "../../services/MarketPortfolioService.tsx";
import {DataPacket} from "../../assets/proto/generated/DataPacket.ts";

interface MarketItem {
  label: string;
  value?: string | number;
  subtext?: string;
}

const PortfolioHeadingAtAGlance: React.FC = () => {
  const [summaryData, setSummaryData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSummary = async () => {
      try {
        const result = await fetchHeadingAtAGlance();

        const binaryData = new Uint8Array(result);
        const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

        const items = [
          {label: 'VIX Index', value: dataPacket.stringDoubleMap.get('^VIX'), subtext: 'Volatility'},
          {label: 'CAD / INR', value: dataPacket.stringDoubleMap.get('CADINR=X'), subtext: 'Forex'},
          {label: 'USD / CAD', value: dataPacket.stringDoubleMap.get('USDCAD=X'), subtext: 'Forex'}
        ].filter(item => item.value !== undefined && item.value !== null);
        console.log(items);

        setSummaryData(items);
      } catch (e) {
        console.error("Failed to fetch market summary", e);
      } finally {
        setLoading(false);
      }
    };

    getSummary();
    const interval = setInterval(getSummary, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && summaryData.length === 0) return <div className="summary-loader">Loading Market Data...</div>;

  return (
    <div className="market-summary-container">
      {summaryData.map((item, index) => (
        <div key={index} className="summary-card glass-card">
          <div className="summary-info">
            <span className="summary-label">{item.label}</span>
            <span className="summary-value">
              {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
            </span>
          </div>
          {item.subtext && <div className="summary-subtext">{item.subtext}</div>}
        </div>
      ))}
    </div>
  );
};

export default PortfolioHeadingAtAGlance;