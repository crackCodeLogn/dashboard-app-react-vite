import React, {useEffect, useMemo, useState} from 'react';
import {fetchDividendYieldAndSectorForAllImnts} from '../../services/MarketPortfolioService.tsx'; // Assumed path
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts'; // Assumed path
import CustomError from '../error/CustomError.tsx';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import './PortfolioMarketInstrumentDivSectorInfo.css';

// --- Data Structures and Types ---

interface InstrumentMarketInfo {
  imnt: string;
  sector: string;
  divYield: number; // Percentage value (e.g., 1.5 for 1.5%)
}

type SortKey = 'imnt' | 'sector' | 'divYield';
type SortDirection = 'asc' | 'desc';

// --- Utility Functions ---

/**
 * Formats a raw dividend yield number (e.g., 1.5) into a display string (e.g., "1.50%").
 * ASSUMES the input is the percentage value itself, as requested.
 * @param yieldValue The raw dividend yield as a double (e.g., 1.5).
 * @returns Formatted percentage string.
 */
const formatDivYield = (yieldValue: number): string => {
  // Removed multiplication by 100 as per request
  return `${yieldValue.toFixed(2)}%`;
};

/**
 * Custom sorting function for the instrument data.
 */
const sortData = (data: InstrumentMarketInfo[], key: SortKey, direction: SortDirection): InstrumentMarketInfo[] => {
  if (key === 'imnt' || key === 'sector') {
    // String sorting
    return [...data].sort((a, b) => {
      const valA = a[key].toUpperCase();
      const valB = b[key].toUpperCase();
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  } else if (key === 'divYield') {
    // Numeric sorting
    return [...data].sort((a, b) => {
      const diff = a.divYield - b.divYield;
      return direction === 'asc' ? diff : -diff;
    });
  }
  return data; // Should not happen
};


const PortfolioMarketInstrumentDivSectorInfoComponent = () => {
  const [marketInfoData, setMarketInfoData] = useState<InstrumentMarketInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>('divYield');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fetch data hook
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const result = await fetchDividendYieldAndSectorForAllImnts();

      if (!result) {
        throw new Error('No market information data received.');
      }

      const binaryData = new Uint8Array(result);
      // Assuming DataPacket is correctly defined and works for deserialization
      const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

      // Assuming these maps contain percentage values (e.g., 1.5 for 1.5%)
      const imntSectorMap = dataPacket.stringStringMap;
      const imntDividendMap = dataPacket.stringDoubleMap;

      if (!imntSectorMap || imntSectorMap.size === 0 || !imntDividendMap || imntDividendMap.size === 0) {
        throw new Error('Empty maps received. No instrument data available.');
      }

      const combinedData: InstrumentMarketInfo[] = [];

      // We can iterate over either map and use the other for lookup
      for (const [imnt, sector] of imntSectorMap.entries()) {
        // Default to 0.0 if no div yield found
        const divYield = imntDividendMap.get(imnt) || 0.0;

        combinedData.push({
          imnt: imnt,
          sector: sector,
          divYield: divYield,
        });
      }

      setMarketInfoData(combinedData);

    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch global instrument data.');
    } finally {
      setLoading(false);
    }
  };

  // Sorting handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if the same key is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!marketInfoData) return [];
    return sortData(marketInfoData, sortKey, sortDirection);
  }, [marketInfoData, sortKey, sortDirection]);

  // Function to render sort arrow
  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  // --- Main Render ---

  return (
    <div className="instrument-market-info-container">
      <h2>Global Instrument Market Information</h2>

      {loading && !errorMsg && (
        <div className="loading-message">
          <Spinner animation="border" size="sm" className="mr-2"/>
          Fetching all instrument data...
        </div>
      )}

      {errorMsg && <CustomError errorMsg={errorMsg}/>}

      {!loading && !errorMsg && sortedData.length > 0 && (
        <div className="wide-table-wrapper">
          <Table striped bordered hover size="sm" className="market-info-table">
            <thead>
            <tr>
              {/* Instrument column - aligned left */}
              <th onClick={() => handleSort('imnt')} className="sortable-header">
                Instrument/Ticker {renderSortArrow('imnt')}
              </th>
              {/* Dividend Yield column - aligned right */}
              <th onClick={() => handleSort('divYield')} className="sortable-header right-align">
                Dividend Yield (%) {renderSortArrow('divYield')}
              </th>
              {/* Sector column - aligned left */}
              <th onClick={() => handleSort('sector')} className="sortable-header">
                Sector Classification {renderSortArrow('sector')}
              </th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((info) => (
              <tr key={info.imnt}>
                <td className="cell-strong">{info.imnt}</td>
                <td className="right-align div-yield-cell">{formatDivYield(info.divYield)}</td>
                <td>{info.sector}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Total count message moved outside the table wrapper for better separation */}
      {!loading && !errorMsg && marketInfoData && marketInfoData.length > 0 && (
        <p className="total-count-message">Total Instruments: {marketInfoData.length}</p>
      )}

      {!loading && !errorMsg && sortedData.length === 0 && (
        <div className="initial-message">No instrument data found.</div>
      )}
    </div>
  );
};

export default PortfolioMarketInstrumentDivSectorInfoComponent;