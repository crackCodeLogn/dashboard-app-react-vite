import React, {useCallback, useEffect, useState} from 'react';
import {fetchAccountMarketSectorImntValuationsData} from '../../services/MarketPortfolioService.tsx'; // Assumed path
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts'; // Assumed path
import CustomError from '../error/CustomError.tsx';
import {Utils} from '../../utils/Utils.tsx'; // For dollar formatting
import './PortfolioMarketSectorImntBreakdown.css'; // Dedicated CSS file

// Define structures for the parsed data
export interface InvestmentValuation {
  imnt: string; // Investment name/symbol
  value: number; // Valuation amount
}

export interface SectorImntBreakdown {
  sector: string;
  investments: InvestmentValuation[];
  sectorTotal: number;
}

const PortfolioMarketSectorImntBreakdownComponent = (props: { accountType: string }) => {
  const {accountType} = props;
  const [sectorBreakdown, setSectorBreakdown] = useState<SectorImntBreakdown[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  // State to manage which sector's details are currently visible (expanded)
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchAccountMarketSectorImntValuationsData(accountType);

      if (!result) {
        throw new Error(`No market sector investment breakdown data found for ${accountType}`);
      }

      // 1. Protobuf Deserialization
      const binaryData = new Uint8Array(result);
      const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

      const breakdown: SectorImntBreakdown[] = [];

      // 2. Map and String Parsing (String -> Sector Breakdown)
      for (const entry of dataPacket.stringStringMap.entries()) {
        const sector = entry[0];
        const imntString = entry[1]; // e.g., "imnt1=val1|imnt2=val2"

        let investments: InvestmentValuation[] = [];
        let sectorTotal = 0;

        if (imntString) {
          // Split by '|' to get individual investment pairs
          imntString.split('|').forEach(pair => {
            const parts = pair.split('=');
            if (parts.length === 2) {
              const imnt = parts[0];
              const value = parseFloat(parts[1]);
              if (!isNaN(value)) {
                investments.push({imnt, value});
                sectorTotal += value;
              }
            }
          });
        }

        // Sort investments within the sector by value (descending)
        investments.sort((a, b) => b.value - a.value);

        breakdown.push({sector, investments, sectorTotal});
      }

      // Sort sectors by their total value (optional, but good practice)
      breakdown.sort((a, b) => b.sectorTotal - a.sectorTotal);

      setSectorBreakdown(breakdown);

    } catch (err) {
      console.error(err);
      setErrorMsg(`Error fetching investment breakdown data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [accountType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle function for the collapsible panel
  const toggleExpand = (sector: string) => {
    setExpandedSector(expandedSector === sector ? null : sector);
  };

  // Render Logic
  if (errorMsg || (sectorBreakdown && sectorBreakdown.length === 0)) {
    return <CustomError errorMsg={errorMsg || 'No Sector Investment Breakdown data available to display.'}/>;
  }

  if (!sectorBreakdown) {
    return <div>Loading Investment Breakdown...</div>;
  }

  return (
    <div className="imnt-breakdown-container">
      <h2>Investment Breakdown by Sector</h2>

      <div className="sector-list">
        {sectorBreakdown.map((sectorData) => (
          <div key={sectorData.sector} className="sector-item">

            {/* Sector Header/Toggle Button */}
            <div
              className="sector-header"
              onClick={() => toggleExpand(sectorData.sector)}
              aria-expanded={expandedSector === sectorData.sector}
              role="button"
              tabIndex={0}
            >
              <span className="sector-title">{sectorData.sector}</span>
              <span className="sector-value cell-strong color-investment">
                {Utils.formatDollar(sectorData.sectorTotal)}
              </span>
              <span className="toggle-icon">
                {expandedSector === sectorData.sector ? '▼' : '▶'}
              </span>
            </div>

            {/* Collapsible Content */}
            <div
              className={`imnt-details-content ${expandedSector === sectorData.sector ? 'expanded' : 'collapsed'}`}
              aria-hidden={expandedSector !== sectorData.sector}
            >
              <ul className="imnt-list">
                {sectorData.investments.map((imnt) => (
                  <li key={imnt.imnt}>
                    <span className="imnt-name">{imnt.imnt}</span>
                    <span className="imnt-valuation">{Utils.formatDollar(imnt.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioMarketSectorImntBreakdownComponent;