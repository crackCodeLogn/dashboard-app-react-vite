import {useCallback, useEffect, useMemo, useState} from 'react';
import {fetchAccountMarketValuationsBestAndWorstPerformersData} from '../../services/MarketPortfolioService.tsx';
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts';
import CustomError from '../error/CustomError.tsx';
import {Utils} from '../../utils/Utils.tsx';
import Table from 'react-bootstrap/Table';
import './PortfolioMarketPerformers.css';

// Define the structure for the parsed performer data
export interface Performer {
  instrument: string;
  pnl: number;        // Profit/Loss
  bookCost: number;   // Actual Book Cost
  currentValue: number; // Book Cost + PNL
  pnlPercent: number; // PNL as a percentage of Book Cost
  isBest: boolean;    // True if a best performer, False if a worst performer
  qty: number;
}

// New types for sorting
type SortKey = 'pnl' | 'pnlPercent' | 'instrument' | 'none';
type SortDirection = 'asc' | 'desc';

const N_STEPS = [10, 15, 25, 50, 75];

const PortfolioMarketPerformersComponent = (props: { accountType: string }) => {
  const {accountType} = props;

  // UI State
  const [n, setN] = useState<number>(15); // Default to showing best/worst 15
  const [useDividends, setUseDividends] = useState<boolean>(false);

  // Sorting States (one for each table, default to PnL% sort)
  const [bestSort, setBestSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'pnlPercent',
    direction: 'desc'
  });
  const [worstSort, setWorstSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'pnlPercent',
    direction: 'asc'
  });

  // Data State
  const [performers, setPerformers] = useState<Performer[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Function to process the raw data string: "<%.02f>|<%.02f>|<%.02f>"
  const parsePerformerData = (rawData: Map<string, string>): Performer[] => {
    const allPerformers: Performer[] = [];

    for (const [instrument, dataString] of rawData.entries()) {
      const parts = dataString.split('|');
      if (parts.length !== 3) continue;

      const pnl = parseFloat(parts[0]);
      const bookCost = parseFloat(parts[1]);
      const qty = parseFloat(parts[2]);

      if (isNaN(pnl) || isNaN(bookCost)) continue;

      const currentValue = bookCost + pnl;
      // Calculate PNL Percentage: PNL / Book Cost * 100. Handle division by zero.
      const pnlPercent = bookCost !== 0 ? (pnl / bookCost) * 100 : 0;

      allPerformers.push({
        instrument,
        pnl,
        bookCost,
        currentValue,
        pnlPercent,
        isBest: false, // Initial state
        qty
      });
      // console.log(allPerformers);
    }

    // --- MODIFIED LOGIC START: Filter, Sort, and Slice based on PnL sign ---

    // Separate into gainers (P&L >= 0) and losers (P&L < 0)
    const gainers = allPerformers.filter(p => p.pnl >= 0);
    const losers = allPerformers.filter(p => p.pnl < 0);

    // 1. Sort Gainers (potential best Performers) by PnL% descending
    gainers.sort((a, b) => b.pnlPercent - a.pnlPercent);

    // 2. Sort Losers (potential Worst Performers) by PnL% ascending (Worst to Least Worst)
    losers.sort((a, b) => a.pnlPercent - b.pnlPercent);

    // 3. Take best N Gainers and mark them as best
    const bestN = gainers.slice(0, n).map(p => ({...p, isBest: true}));

    // 4. Take best N Losers (the Worst N) and mark them as not best
    const worstN = losers.slice(0, n).map(p => ({...p, isBest: false}));

    // --- MODIFIED LOGIC END ---

    return [...bestN, ...worstN];
  };

  const fetchData = useCallback(async () => {
    setErrorMsg('');
    setPerformers(null);
    try {
      const result = await fetchAccountMarketValuationsBestAndWorstPerformersData(accountType, n, useDividends);

      if (!result) {
        throw new Error(`No performer data found for ${accountType}`);
      }

      // 1. Protobuf Deserialization
      const binaryData = new Uint8Array(result);
      const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

      setPerformers(parsePerformerData(dataPacket.stringStringMap));

    } catch (err) {
      console.error(err);
      setErrorMsg(`Error fetching performers data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [accountType, n, useDividends]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sorting function generator
  const getSortedPerformers = useCallback((data: Performer[], sortState: {
    key: SortKey;
    direction: SortDirection
  }): Performer[] => {
    if (sortState.key === 'none') return data;

    const sorted = [...data];
    const {key, direction} = sortState;

    sorted.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Handle string comparisons (Instrument)
      if (typeof valA === 'string' && typeof valB === 'string') {
        const result = valA.localeCompare(valB);
        return direction === 'asc' ? result : -result;
      }

      // Numerical sort
      const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, []);

  // Data separation and sorting using useMemo
  const allBestPerformers = useMemo(() => performers?.filter(p => p.isBest) || [], [performers]);
  const allWorstPerformers = useMemo(() => performers?.filter(p => !p.isBest) || [], [performers]);

  const sortedBestPerformers = getSortedPerformers(allBestPerformers, bestSort);
  const sortedWorstPerformers = getSortedPerformers(allWorstPerformers, worstSort);

  // Handler for column click
  const handleSort = (listType: 'best' | 'worst', key: SortKey) => {
    const currentSort = listType === 'best' ? bestSort : worstSort;
    let newDirection: SortDirection = 'desc';

    if (currentSort.key === key) {
      // Toggle direction if clicking the same column
      newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Default initial sort for PnL and PnL% is descending (highest first)
      newDirection = (key === 'pnl' || key === 'pnlPercent') ? 'desc' : 'asc';
    }

    const newSortState = {key, direction: newDirection};

    if (listType === 'best') {
      setBestSort(newSortState);
    } else {
      setWorstSort(newSortState);
    }
  };

  // Helper function to show the sort icon
  const getSortIcon = (currentKey: SortKey, sortState: { key: SortKey; direction: SortDirection }) => {
    if (currentKey !== sortState.key) return '⇅'; // Unsorted icon
    return sortState.direction === 'asc' ? '▲' : '▼';
  };


  // Component to render a list of performers
  const PerformerTable = ({title, data, listType}: {
    title: string;
    data: Performer[];
    listType: 'best' | 'worst'
  }) => {
    const sortState = listType === 'best' ? bestSort : worstSort;

    return (
      <div className="performer-list-container">
        <h3>{title}</h3>
        <Table striped bordered hover size="sm" className="performer-table">
          <thead>
          <tr>
            <th
              onClick={() => handleSort(listType, 'instrument')}
              className="sortable"
            >
              Instrument <span className="sort-indicator">{getSortIcon('instrument', sortState)}</span>
            </th>
            <th className="right-align">Qty</th>
            <th className="right-align">Book Cost</th>
            <th className="right-align">Current Value</th>
            <th
              onClick={() => handleSort(listType, 'pnlPercent')}
              className="right-align sortable"
            >
              P&L (%) <span className="sort-indicator">{getSortIcon('pnlPercent', sortState)}</span>
            </th>
            <th
              onClick={() => handleSort(listType, 'pnl')}
              className="right-align sortable"
            >
              P&L ($) <span className="sort-indicator">{getSortIcon('pnl', sortState)}</span>
            </th>
          </tr>
          </thead>
          <tbody>
          {data.map((p) => {
            // Note: Since data is already filtered, isPositive will be true for 'best' and false for 'worst'
            const isPositive = p.pnl >= 0;
            const pnlClass = isPositive ? 'gain' : 'loss';
            const icon = isPositive ? '▲' : '▼'; // Up triangle for gain, down for loss

            return (
              <tr key={p.instrument}>
                <td className="cell-strong">{p.instrument}</td>
                <td className="right-align">{Utils.yValueFormat(p.qty)}</td>
                <td className="right-align">{Utils.formatDollar(p.bookCost)}</td>
                <td className="right-align">{Utils.formatDollar(p.currentValue)}</td>
                {/* P&L (%) Column with colored icon */}
                <td className={`right-align`}>
                  <span className={`pnl-icon ${pnlClass}`}>{icon}</span>
                  {p.pnlPercent.toFixed(2)}%
                </td>

                {/* P&L ($) Column with colored icon */}
                <td className={`right-align`}>
                  <span className={`pnl-icon ${pnlClass}`}>{icon}</span>
                  {Utils.formatDollar(p.pnl)}
                </td>
              </tr>
            );
          })}
          </tbody>
        </Table>
        {data.length === 0 && <p className="no-data-msg">No data available for this selection.</p>}
      </div>
    );
  };

  return (
    <div className="performers-component-container">
      <h2>Best / Worst Performers: {accountType}</h2>

      {/* Control Panel */}
      <div className="control-panel">
        <label>
          Show Best/Worst N:
          <select
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="n-select"
          >
            {N_STEPS.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={useDividends}
            onChange={(e) => setUseDividends(e.target.checked)}
          />
          <span>Include Dividends</span>
        </label>
        <button onClick={fetchData} className="refresh-button">Refresh Data</button>
      </div>

      {errorMsg && <CustomError errorMsg={errorMsg}/>}

      {/* Performers Display */}
      {performers && performers.length > 0 ? (
        <div className="performers-flex-container">
          <PerformerTable
            title={`Best ${n} Performers`}
            data={sortedBestPerformers}
            listType="best"
          />
          <PerformerTable
            title={`Worst ${n} Performers`}
            data={sortedWorstPerformers}
            listType="worst"
          />
        </div>
      ) : (
        !errorMsg && performers && <p className="no-data-msg">No instruments found to rank.</p>
      )}
    </div>
  );
};

export default PortfolioMarketPerformersComponent;