import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import Table from 'react-bootstrap/Table';
// Assuming DataPacket path is correct based on original context
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts';
import CustomError from '../error/CustomError.tsx';
import {Utils} from '../../utils/Utils.tsx';
import './PortfolioNetMarketValuationData.css';
import {fetchNetMarketValuationsData} from "../../services/MarketPortfolioService.tsx";

// --- KEY DEFINITIONS (Replicated from user prompt) ---
const KEY_ACCOUNT_TYPES = "accountTypes";
const KEY_BOOK_VAL = "bookVal";
const KEY_CURRENT_VAL = "currentVal";
const KEY_DIV_YIELD_PERCENT = "divYieldPercent";
const KEY_IMNT = "imnt";
const KEY_PNL = "pnl";
const KEY_SECTOR = "sector";
const KEY_TOTAL_DIV = "totalDiv";

// --- Configuration ---
const SECTOR_LIMIT = 8; // Max number of sectors to display before grouping into 'Other'

// --- Data Structure ---
export interface PositionData {
  accountTypes: string;
  bookVal: number;
  currentVal: number;
  divYieldPercent: number;
  imnt: string; // Instrument name
  pnl: number;
  sector: string;
  totalDiv: number;
  pnlPercent: number; // Calculated field
}

export interface AggregationData {
  totalBookVal: number;
  totalCurrentVal: number;
  totalPnL: number;
  totalTotalDiv: number;
  overallPnLPercent: number;
}

// --- Sorting Types ---
type SortKey = keyof PositionData | 'pnlPercent'; // Include the calculated key
type SortDirection = 'asc' | 'desc';

// --- PIE CHART CONFIG ---
export interface SectorValuation {
  name: string; // Sector name
  value: number; // Valuation amount (currentVal)
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AF19FF', '#FF4560', '#546E7A', '#7CFC00',
  '#33b5e5', '#aa66cc', '#cc0000', '#ff8a80', // Additional colors for variety
];


// --- Data Parsing Function ---
const parseNetMarketValuationData = (dataStrings: string[]): PositionData[] => {
  const positions: PositionData[] = [];

  for (const line of dataStrings) {
    const fields = line.split('|');
    const dataMap: Record<string, string> = {};

    for (const field of fields) {
      const [key, value] = field.split('=');
      if (key && value) {
        dataMap[key] = value;
      }
    }

    const bookVal = parseFloat(dataMap[KEY_BOOK_VAL] || '0');
    const currentVal = parseFloat(dataMap[KEY_CURRENT_VAL] || '0');
    const totalDiv = parseFloat(dataMap[KEY_TOTAL_DIV] || '0');
    let pnl = parseFloat(dataMap[KEY_PNL] || '0');

    if (isNaN(bookVal) || isNaN(currentVal) || isNaN(pnl) || isNaN(totalDiv)) {
      console.warn(`Skipping malformed data line: ${line}`);
      continue;
    }

    // Calculate PnL % based on bookVal
    const pnlPercent = bookVal !== 0 ? (pnl / bookVal) * 100 : 0;

    const position: PositionData = {
      accountTypes: dataMap[KEY_ACCOUNT_TYPES] || 'N/A',
      bookVal: bookVal,
      currentVal: currentVal,
      divYieldPercent: parseFloat(dataMap[KEY_DIV_YIELD_PERCENT] || '0'),
      imnt: dataMap[KEY_IMNT] || 'N/A',
      pnl: pnl,
      sector: dataMap[KEY_SECTOR] || 'Unassigned',
      totalDiv: totalDiv,
      pnlPercent: pnlPercent,
    };

    positions.push(position);
  }
  return positions;
};


const PortfolioNetMarketValuationDataComponent = () => {
  // --- State ---
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [useDividends, setUseDividends] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sortState, setSortState] = useState<{ key: SortKey; direction: SortDirection }>({key: 'pnlPercent', direction: 'desc'});

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    setErrorMsg('');
    setPositions([]);
    try {
      // 1. Fetch Data (mocked/placeholder)
      const result = await fetchNetMarketValuationsData(useDividends);

      if (!result) {
        throw new Error(`No net market valuation data found.`);
      }

      const binaryData = new Uint8Array(result);
      const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

      // 3. Parse Data
      const parsedData = parseNetMarketValuationData(dataPacket.strings);
      setPositions(parsedData);

    } catch (err) {
      console.error(err);
      // @ts-ignore
      setErrorMsg(`Error fetching portfolio data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [useDividends]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // --- Data Processing (Memoized) ---

  // 1. Sorting Logic
  const sortedPositions = useMemo(() => {
    const sorted = [...positions];
    const {key, direction} = sortState;

    sorted.sort((a, b) => {
      // Handle the calculated pnlPercent field
      const valA = key === 'pnlPercent' ? a.pnlPercent : a[key as keyof PositionData];
      const valB = key === 'pnlPercent' ? b.pnlPercent : b[key as keyof PositionData];

      // Handle string comparisons
      if (typeof valA === 'string' && typeof valB === 'string') {
        const result = valA.localeCompare(valB);
        return direction === 'asc' ? result : -result;
      }

      // Numerical sort
      const numA = valA as number;
      const numB = valB as number;

      const comparison = numA > numB ? 1 : numA < numB ? -1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [positions, sortState]);

  // 2. Aggregation Logic
  const aggregationData: AggregationData = useMemo(() => {
    const agg: AggregationData = {
      totalBookVal: 0,
      totalCurrentVal: 0,
      totalPnL: 0,
      totalTotalDiv: 0,
      overallPnLPercent: 0
    };

    if (positions.length === 0) return agg;

    agg.totalBookVal = positions.reduce((sum, p) => sum + p.bookVal, 0);
    agg.totalCurrentVal = positions.reduce((sum, p) => sum + p.currentVal, 0);
    // Use the *calculated* PnL which includes or excludes dividends based on the checkbox state
    agg.totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
    agg.totalTotalDiv = positions.reduce((sum, p) => sum + p.totalDiv, 0);

    // Calculate overall PnL Percent using aggregated PnL and BookVal
    agg.overallPnLPercent = agg.totalBookVal !== 0 ? (agg.totalPnL / agg.totalBookVal) * 100 : 0;

    return agg;
  }, [positions]);

  // 3. Pie Chart Data (Sectorial Distribution by currentVal)
  const pieChartData: SectorValuation[] = useMemo(() => {
    const sectorMap = new Map<string, number>();
    positions.forEach(p => {
      const currentVal = p.currentVal;
      const sector = p.sector;
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + currentVal);
    });

    let data: SectorValuation[] = [];
    for (const [name, value] of sectorMap.entries()) {
      data.push({name, value});
    }

    // Sort by value descending
    data.sort((a, b) => b.value - a.value);

    // LIMITING LOGIC: Group smaller sectors into 'Other'
    if (data.length > SECTOR_LIMIT) {
      const topSectors = data.slice(0, SECTOR_LIMIT - 1); // Keep N-1 sectors
      const otherSectors = data.slice(SECTOR_LIMIT - 1);

      const otherValue = otherSectors.reduce((sum, sector) => sum + sector.value, 0);

      topSectors.push({name: 'Other', value: otherValue});
      return topSectors;
    }

    return data;
  }, [positions]);

  // --- UI Handlers ---
  const handleSort = (key: SortKey) => {
    let newDirection: SortDirection = 'asc';

    if (sortState.key === key) {
      // Toggle direction if clicking the same column
      newDirection = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Default sort for numerical values (BookVal, CurrentVal, PnL, PnL%) is descending (largest first)
      if (key !== KEY_IMNT && key !== KEY_ACCOUNT_TYPES && key !== KEY_SECTOR) {
        newDirection = 'desc';
      }
    }

    setSortState({key, direction: newDirection});
  };

  const getSortIcon = (key: SortKey) => {
    if (sortState.key !== key) return '⇅';
    return sortState.direction === 'asc' ? '▲' : '▼';
  };

  const totalMarketValue = aggregationData.totalCurrentVal;


  // --- Sub-Components ---

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalMarketValue > 0 ? ((data.value / totalMarketValue) * 100).toFixed(2) : 0;
      return (
        <div className="custom-tooltip">
          <p className="label cell-strong">{`${data.name}: ${Utils.formatDollar(data.value)}`}</p>
          <p className="intro">{`(${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Aggregation Row Component
  const AggregationRow = () => {
    const {totalPnL, overallPnLPercent, totalBookVal, totalCurrentVal, totalTotalDiv} = aggregationData;
    const isPositive = totalPnL >= 0;
    const pnlClass = isPositive ? 'gain' : 'loss';
    const icon = isPositive ? '▲' : '▼';

    return (
      <tr className="aggregation-row">
        <td>TOTAL ({positions.length})</td>
        {/* imnt column */}
        <td></td>
        {/* Acct Type column */}
        <td></td>
        {/* sector column */}
        <td className="right-align cell-strong">{Utils.formatDollar(totalBookVal)}</td>
        <td className="right-align cell-strong">{Utils.formatDollar(totalCurrentVal)}</td>

        {/* Total P&L (%) Column */}
        <td className="right-align cell-strong">
          <span className={`pnl-arrow ${pnlClass}`}>{icon}</span>
          {overallPnLPercent.toFixed(2)}%
        </td>

        {/* Total P&L ($) Column */}
        <td className="right-align cell-strong">
          <span className={`pnl-arrow ${pnlClass}`}>{icon}</span>
          {Utils.formatDollar(totalPnL)}
        </td>

        <td className="right-align cell-strong">{Utils.formatDollar(totalTotalDiv)}</td>
        <td></td>
        {/* Div Yield % column */}
      </tr>
    );
  };


  // --- Main Render Logic ---
  if (errorMsg) {
    return <CustomError errorMsg={errorMsg}/>;
  }

  if (positions.length === 0 && !errorMsg) {
    return (
      <div className="net-mv-container">
        <h2>Net Market Valuations (All Instruments)</h2>
        <div className="control-panel">
          <label>
            <input
              type="checkbox"
              checked={useDividends}
              onChange={(e) => setUseDividends(e.target.checked)}
            />
            <span>Include Dividends in P&L Calculation</span>
          </label>
          <button onClick={fetchData} className="refresh-button">Refresh Data</button>
        </div>
        <p className="no-data-msg">Loading data or no instruments found...</p>
      </div>
    );
  }

  return (
    <div className="net-mv-container">
      <h2>Net Market Valuations (All Instruments)</h2>

      {/* Control Panel */}
      <div className="control-panel">
        <label>
          <input
            type="checkbox"
            checked={useDividends}
            onChange={(e) => setUseDividends(e.target.checked)}
          />
          <span>Include Dividends in P&L Calculation</span>
        </label>
        <button onClick={fetchData} className="refresh-button">Refresh Data</button>
      </div>

      <div className="mv-flex-container">
        {/* LEFT SIDE: SECTOR PIE CHART */}
        {/* Using height 350 to align with the max-height: 450px on the table-scroll-wrapper in the CSS */}
        <div className="mv-chart-container">
          <h3>Sectorial Distribution (Current Value)</h3>
          <p className="total-label">Total Market Value: <span className="cell-strong color-investment">{Utils.formatDollar(totalMarketValue)}</span>
          </p>
          <div className="chart-area-inner">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({name, percent}) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                  paddingAngle={2}
                >
                  {pieChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
            <Legend
              payload={pieChartData.map((item, index) => ({
                value: item.name,
                type: 'square',
                id: item.name,
                color: COLORS[index % COLORS.length]
              }))}
              layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{paddingTop: '20px'}}
            />
          </div>
        </div>


        {/* RIGHT SIDE: POSITIONS TABLE */}
        <div className="mv-table-container">
          <h3>Position Details</h3>
          <div className="table-scroll-wrapper">
            <Table striped bordered hover size="sm" className="positions-table">
              <thead>
              <AggregationRow/>
              <tr>
                <th onClick={() => handleSort(KEY_IMNT as SortKey)} className="sortable">
                  Instrument <span className="sort-indicator">{getSortIcon(KEY_IMNT as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_ACCOUNT_TYPES as SortKey)} className="sortable">
                  Acct Type <span className="sort-indicator">{getSortIcon(KEY_ACCOUNT_TYPES as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_SECTOR as SortKey)} className="sortable">
                  Sector <span className="sort-indicator">{getSortIcon(KEY_SECTOR as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_BOOK_VAL as SortKey)} className="right-align sortable">
                  Book Val <span className="sort-indicator">{getSortIcon(KEY_BOOK_VAL as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_CURRENT_VAL as SortKey)} className="right-align sortable">
                  Current Val <span className="sort-indicator">{getSortIcon(KEY_CURRENT_VAL as SortKey)}</span>
                </th>
                <th onClick={() => handleSort('pnlPercent' as SortKey)} className="right-align sortable">
                  P&L (%) <span className="sort-indicator">{getSortIcon('pnlPercent' as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_PNL as SortKey)} className="right-align sortable">
                  P&L ($) <span className="sort-indicator">{getSortIcon(KEY_PNL as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_TOTAL_DIV as SortKey)} className="right-align sortable">
                  Total Div <span className="sort-indicator">{getSortIcon(KEY_TOTAL_DIV as SortKey)}</span>
                </th>
                <th onClick={() => handleSort(KEY_DIV_YIELD_PERCENT as SortKey)} className="right-align sortable">
                  Div Yield % <span className="sort-indicator">{getSortIcon(KEY_DIV_YIELD_PERCENT as SortKey)}</span>
                </th>
              </tr>
              </thead>
              <tbody>
              {sortedPositions.map((p, index) => {
                const isPositive = p.pnl >= 0;
                const pnlClass = isPositive ? 'gain' : 'loss';
                const icon = isPositive ? <span className="pnl-arrow green-arrow">▲</span> : <span className="pnl-arrow red-arrow">▼</span>;

                return (
                  // Using index in key as a fallback since imnt+accountTypes might not be unique in mock data
                  <tr key={p.imnt + p.accountTypes + index}>
                    <td className="cell-strong">{p.imnt}</td>
                    <td>{p.accountTypes}</td>
                    <td>{p.sector}</td>
                    <td className="right-align">{Utils.formatDollar(p.bookVal)}</td>
                    <td className="right-align">{Utils.formatDollar(p.currentVal)}</td>

                    {/* P&L (%) Column with colored icon */}
                    <td className={`right-align ${pnlClass}`}>
                      {icon}
                      {p.pnlPercent.toFixed(2)}%
                    </td>

                    {/* P&L ($) Column with colored icon */}
                    <td className={`right-align ${pnlClass}`}>
                      {icon}
                      {Utils.formatDollar(p.pnl)}
                    </td>

                    <td className="right-align">{Utils.formatDollar(p.totalDiv)}</td>
                    <td className="right-align">{p.divYieldPercent.toFixed(2)}%</td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioNetMarketValuationDataComponent;
