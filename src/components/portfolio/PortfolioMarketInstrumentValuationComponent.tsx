import React, {useCallback, useState} from 'react';
import {fetchAccountMarketImntValuationData} from '../../services/MarketPortfolioService.tsx'; // Assumed path
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts'; // Assumed path
import CustomError from '../error/CustomError.tsx';
import {Utils} from '../../utils/Utils.tsx'; // For dollar formatting
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner'; // For loading state
import './PortfolioMarketInstrumentValuation.css'; // New CSS file

// --- Data Structures ---

// Corrected keys provided by the user, including the two new ones
const API_KEYS = {
  IMNT: 'imnt',
  ACCOUNT_TYPE: 'accountType',
  SECTOR: 'sector',
  DIV_YIELD: 'divYieldPercent',
  BOOK_VAL: 'bookVal',
  CURRENT_VAL: 'currentVal',
  PNL: 'pnl',
  TOTAL_DIV: 'totalDiv',
};

// Parsed, structured data for a single account
interface InstrumentValuation {
  instrument: string; // Used to confirm instrument from API
  accountType: string; // Used to confirm account type from API
  bookVal: number;
  pnl: number;
  currentVal: number;
  divYield: string; // Formatted string
  totalDiv: number;
  sector: string;
  pnlDisplay: { // For visual P&L
    value: string; // $ formatted value
    className: string; // 'gain' or 'loss'
    icon: string; // '▲' or '▼'
  };
}

// Account types supported
const ACCOUNT_TYPES = ['TFSA', 'NR', 'FHSA'];
const ACCOUNT_OPTIONS = ['ALL', ...ACCOUNT_TYPES];

// --- Utilities for Parsing and Formatting ---

/**
 * Parses the raw API result (Map<string, string>) into a structured, formatted object.
 * The function now uses the 'imnt' and 'accountType' keys from the raw data for robustness.
 * @param rawData Map from the API response
 */
const parseAndFormatData = (rawData: Map<string, string>): InstrumentValuation => {

  // --- New Key Extraction ---
  const instrument = rawData.get(API_KEYS.IMNT) || 'UNKNOWN';
  const accountType = rawData.get(API_KEYS.ACCOUNT_TYPE) || 'UNKNOWN';
  // ------------------------

  const rawPnl = parseFloat(rawData.get(API_KEYS.PNL) || '0');
  const isPositive = rawPnl >= 0;

  // Determine PNL display properties
  const pnlDisplay = {
    value: Utils.formatDollar(rawPnl),
    className: isPositive ? 'gain' : 'loss',
    icon: isPositive ? '▲' : '▼',
  };

  return {
    instrument,
    accountType,
    bookVal: parseFloat(rawData.get(API_KEYS.BOOK_VAL) || '0'),
    pnl: rawPnl,
    currentVal: parseFloat(rawData.get(API_KEYS.CURRENT_VAL) || '0'),
    divYield: `${rawData.get(API_KEYS.DIV_YIELD) || '0.00'}%`,
    totalDiv: parseFloat(rawData.get(API_KEYS.TOTAL_DIV) || '0'),
    sector: rawData.get(API_KEYS.SECTOR) || 'N/A',
    pnlDisplay,
  };
};

// --- Component Definition ---

const PortfolioMarketInstrumentValuationComponent = () => {
  // Component State
  const [instrument, setInstrument] = useState('');
  const [accountType, setAccountType] = useState('TFSA');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<InstrumentValuation[] | InstrumentValuation | null>(null);

  const handleFetch = useCallback(async () => {
    if (!instrument) {
      setErrorMsg('Please enter an instrument name (e.g., AAPL).');
      setData(null);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setData(null);

    try {
      if (accountType === 'ALL') {
        // 1. Handle ALL: Fetch for each individual account in parallel
        const promises = ACCOUNT_TYPES.map(accType =>
          // Pass the user-entered instrument name, but use the specific account type
          fetchAccountMarketImntValuationData(instrument, accType)
        );

        const results = await Promise.allSettled(promises);

        const combinedData: InstrumentValuation[] = [];
        let failed = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            const binaryData = new Uint8Array(result.value);
            const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

            // Check if the map is empty, indicating no holding in this account
            if (dataPacket.stringStringMap && dataPacket.stringStringMap.size > 0) {
              // Pass the raw map to the parser. It will extract the accountType from the map.
              combinedData.push(parseAndFormatData(dataPacket.stringStringMap));
            }
          } else {
            console.error(`Error fetching data for ${ACCOUNT_TYPES[index]}:`, result.reason);
            failed = true;
          }
        });

        if (combinedData.length === 0) {
          setErrorMsg(`No holdings found for ${instrument} across all accounts.`);
        } else {
          setData(combinedData);
        }
        if (failed && combinedData.length > 0) {
          console.warn("Some account fetches failed. Showing partial results.");
        }

      } else {
        // 2. Handle Single Account (TFSA, NR, FHSA)
        const result = await fetchAccountMarketImntValuationData(instrument, accountType);

        if (!result) {
          throw new Error(`No valuation data found for ${instrument} in ${accountType}`);
        }

        const binaryData = new Uint8Array(result);
        const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

        if (dataPacket.stringStringMap.size === 0) {
          throw new Error(`Instrument ${instrument} not held in ${accountType}.`);
        }

        // Pass the raw map to the parser.
        setData(parseAndFormatData(dataPacket.stringStringMap));
      }

    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [instrument, accountType]);

  // --- Sub-Components for Rendering ---

  const SingleAccountDisplay = ({data}: { data: InstrumentValuation }) => (
    <div className="single-valuation-display">
      {/* Use data.instrument and data.accountType derived from the API response */}
      <h2 className="display-title">{data.instrument} - {data.accountType}</h2>

      <div className="single-data-grid">

        <div className="data-item key-item">Sector</div>
        <div className="data-item value-item cell-strong">{data.sector}</div>

        <div className="data-item key-item">Book Value</div>
        <div className="data-item value-item">{Utils.formatDollar(data.bookVal)}</div>

        <div className="data-item key-item">P&L</div>
        <div className={`data-item value-item ${data.pnlDisplay.className}`}>
          <span className="pnl-icon">{data.pnlDisplay.icon}</span>
          {data.pnlDisplay.value}
        </div>

        <div className="data-item key-item">Current Value</div>
        <div className="data-item value-item">{Utils.formatDollar(data.currentVal)}</div>

        <div className="data-item key-item">P&L (%)</div>
        <div className={`data-item value-item ${data.pnlDisplay.className}`}>
          <span className="pnl-icon">{data.pnlDisplay.icon}</span>
          {Utils.getPercentage(data.pnl, data.bookVal)}
        </div>

        <div className="data-item key-item">Dividend Yield</div>
        <div className="data-item value-item">{data.divYield}</div>

        <div className="data-item key-item">Total Dividends</div>
        <div className="data-item value-item">{Utils.formatDollar(data.totalDiv)}</div>

      </div>
    </div>
  );

  const AllAccountsTable = ({data}: { data: InstrumentValuation[] }) => {
    // Calculate Totals
    const totals = data.reduce((acc, val) => ({
      bookVal: acc.bookVal + val.bookVal,
      pnl: acc.pnl + val.pnl,
      currentVal: acc.currentVal + val.currentVal,
      totalDiv: acc.totalDiv + val.totalDiv,
    }), {bookVal: 0, pnl: 0, currentVal: 0, totalDiv: 0});

    const totalPnlDisplay = {
      value: Utils.formatDollar(totals.pnl),
      className: totals.pnl >= 0 ? 'gain' : 'loss',
      icon: totals.pnl >= 0 ? '▲' : '▼',
    };

    return (
      <div className="multi-valuation-display">
        {/* Use instrument name from the first result */}
        <h2 className="display-title">{data[0].instrument} - Combined Account Valuation</h2>
        <Table striped bordered hover size="sm" className="valuation-table">
          <thead>
          <tr>
            <th>Account</th>
            <th className="right-align">Book Value</th>
            <th className="right-align">P&L</th>
            <th className="right-align">Current Value</th>
            <th className="right-align">P&L (%)</th>
            <th className="right-align">Div Yield</th>
            <th className="right-align">Total Dividends</th>
            <th>Sector</th>
          </tr>
          </thead>
          <tbody>
          {data.map((val) => (
            <tr key={val.accountType}>
              {/* Use val.accountType from the API response */}
              <td className="cell-strong">{val.accountType}</td>
              <td className="right-align">{Utils.formatDollar(val.bookVal)}</td>
              <td className={`right-align`}>
                <span className={`pnl-icon ${val.pnlDisplay.className}`}>{val.pnlDisplay.icon}</span>
                {val.pnlDisplay.value}
              </td>
              <td className="right-align">{Utils.formatDollar(val.currentVal)}</td>
              <td className={`right-align`}>
                <span className={`pnl-icon ${val.pnlDisplay.className}`}>{val.pnlDisplay.icon}</span>
                {Utils.getPercentage(val.pnl, val.bookVal)}
              </td>
              <td className="right-align">{val.divYield}</td>
              <td className="right-align">{Utils.formatDollar(val.totalDiv)}</td>
              <td>{val.sector}</td>
            </tr>
          ))}
          {/* TOTALS ROW */}
          <tr className="total-row">
            <td className="cell-strong">TOTAL</td>
            <td className="right-align cell-strong">{Utils.formatDollar(totals.bookVal)}</td>
            <td className={`right-align cell-strong`}>
              <span className={`pnl-icon ${totalPnlDisplay.className}`}>{totalPnlDisplay.icon}</span>
              {totalPnlDisplay.value}
            </td>
            <td className="right-align cell-strong">{Utils.formatDollar(totals.currentVal)}</td>
            <td className="right-align"></td>
            <td className="right-align"></td>
            {/* Div Yield N/A */}
            <td className="right-align cell-strong">{Utils.formatDollar(totals.totalDiv)}</td>
            <td></td>
            {/* Sector N/A */}
          </tr>
          </tbody>
        </Table>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="instrument-valuation-container">
      <h1>Instrument Valuation Lookup</h1>

      {/* Control Panel */}
      <div className="control-panel valuation-controls">
        <input
          type="text"
          placeholder="Enter Instrument (e.g., AAPL)"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
        />
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="account-select"
        >
          {ACCOUNT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button onClick={handleFetch} className="fetch-button" disabled={loading || !instrument}>
          {loading ? <Spinner animation="border" size="sm"/> : 'Fetch Data'}
        </button>
      </div>

      {/* Content Area */}
      {errorMsg && <CustomError errorMsg={errorMsg}/>}

      {!loading && data && (
        Array.isArray(data) && accountType === 'ALL'
          ? <AllAccountsTable data={data}/>
          : !Array.isArray(data) && <SingleAccountDisplay data={data}/>
      )}

      {loading && !errorMsg && (
        <div className="loading-message">Fetching data for {instrument} in {accountType}...</div>
      )}

      {!loading && !errorMsg && !data && (
        <div className="initial-message">Enter an instrument and select an account type to view valuation details.</div>
      )}
    </div>
  );
};

export default PortfolioMarketInstrumentValuationComponent;