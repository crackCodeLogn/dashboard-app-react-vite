import React, {useMemo, useState} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import './StrategyPortfolioOptimizerDashboard.css';
import {invokePortfolioOptimizer} from "../../../services/MarketPortfolioService.tsx";
import {Instrument, Portfolio} from "../../../assets/proto/generated/MarketData.ts";

// Type definitions for the parsed Protobuf data
interface StrategySummary {
  beta: string;
  epr: string;
  epy: string;
  pe: string;
  vol: string;
  sharpe: string;
  status: string;
}

interface InstrumentRow {
  ticker: string;
  sector: string;
  qty: number;
  currentVal: number;
  targetVal: number;
  delta: number;
  action: string;
  divYield: number;
  epr: number;
  beta: number;
  pe: number;
  sharpe: number;
  vol: number;
}

const columnHelper = createColumnHelper<InstrumentRow>();

const parseSummary = (baseStatImnt: Instrument): StrategySummary => {
  return {
    beta: baseStatImnt.metaData.get('strategy_beta') || '0.0',
    epr: baseStatImnt.metaData.get('strategy_epr') || '0.0',
    epy: baseStatImnt.metaData.get('strategy_epy') || '0.0',
    pe: baseStatImnt.metaData.get('strategy_pe') || '0.0',
    vol: baseStatImnt.metaData.get('strategy_vol') || '0.0',
    sharpe: baseStatImnt.metaData.get('strategy_sharpe') || '0.0',
    status: baseStatImnt.metaData.get('strategy_status') || ''
  }
};

const parseTableData = (instruments: Instrument[]) => {
  const imntRows: InstrumentRow[] = [];
  instruments.map(imnt => {
    const currentVal = parseFloat(imnt.metaData.get('current_val') || '0.0');
    const targetVal = parseFloat(imnt.metaData.get('target_val') || '0.0');
    imntRows.push(
      {
        ticker: imnt.ticker.symbol,
        sector: imnt.ticker.sector,
        qty: imnt.qty * 100.0,
        currentVal: currentVal,
        targetVal: targetVal,
        delta: targetVal - currentVal,
        divYield: imnt.dividendYield * 100.0,
        epr: parseFloat(imnt.metaData.get('return') || '0.0') * 100.0,
        beta: imnt.beta,
        pe: parseFloat(imnt.metaData.get('pe_ratio') || '0.0'),
        sharpe: parseFloat(imnt.metaData.get('sharpe_ratio') || '0.0'),
        vol: parseFloat(imnt.metaData.get('std_dev') || '0.0') * 100.0,
        action: imnt.metaData.get('action') || ''
      }
    )
  });
  return imntRows;
}

const StrategyPortfolioOptimizerDashboard: React.FC = () => {

  // --- Input States ---
  const [params, setParams] = useState({
    accountType: 'FHSA',
    targetBeta: 1.05,
    minYield: 3.0,
    maxPe: 90.0,
    maxVol: 35.0,
    newCash: 0.0,
    forceCash: 0.0,
    objectiveMode: 'MAX_RETURN',
    ignoreImnts: '',
    forceImnts: '',
    imntsScope: 'ACCOUNT_LEVEL'
  });

  // --- Output States ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [summary, setSummary] = useState<StrategySummary | null>(null);
  const [tableData, setTableData] = useState<InstrumentRow[]>([]);

  // --- Column Definitions ---
  const columns = useMemo(() => [
    columnHelper.accessor('ticker', {header: 'Ticker'}),
    columnHelper.accessor('sector', {header: 'Sector'}),
    columnHelper.accessor('qty', {header: 'Qty %', cell: info => info.getValue().toFixed(2)}),
    columnHelper.accessor('currentVal', {header: 'Current ($)', cell: info => info.getValue().toLocaleString()}),
    columnHelper.accessor('targetVal', {header: 'Target ($)', cell: info => info.getValue().toLocaleString()}),
    columnHelper.accessor('delta', {
      header: 'Delta ($)',
      cell: info => {
        const val = info.getValue();
        return <span className={val >= 0 ? 'text-pos' : 'text-neg'}>{val.toFixed(2)}</span>
      }
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: info => <span
        className={`action-badge ${info.getValue().split(' ')[0].toLowerCase()}`}>{info.getValue()}</span>
    }),
    columnHelper.accessor('divYield', {header: 'Yield %', cell: info => `${info.getValue().toFixed(2)}`}),
    columnHelper.accessor('epr', {header: 'EPR %', cell: info => `${(info.getValue()).toFixed(2)}`}),
    columnHelper.accessor('beta', {header: 'Beta', cell: info => info.getValue().toFixed(2)}),
    columnHelper.accessor('pe', {header: 'P/E', cell: info => info.getValue().toFixed(2)}),
    columnHelper.accessor('sharpe', {header: 'SR', cell: info => info.getValue().toFixed(2)}),
    columnHelper.accessor('vol', {header: 'Vol %', cell: info => info.getValue().toFixed(2)}),
  ], []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {sorting},
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await invokePortfolioOptimizer(params.accountType, params.targetBeta, params.minYield / 100, params.maxPe, params.maxVol / 100,
      params.newCash, params.forceCash, params.objectiveMode, params.ignoreImnts, params.forceImnts, params.imntsScope);
    if (!result) throw new Error(`No data found.`);

    const binaryData = new Uint8Array(result);
    const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);
    if (!portfolio || portfolio.instruments.length === 0) throw new Error('Invalid response');

    const summary = parseSummary(portfolio.instruments[0]);
    setSummary(summary);
    const tableData = parseTableData(portfolio.instruments.slice(1));
    setTableData(tableData);
  };

  return (
    <div className="optimizer-page">
      {/* HEADER SECTION */}
      <header className="optimizer-header-main">
        <h1>Strategy Portfolio Optimizer</h1>
        <p>Engineering Marvel, Risk-Adjusted for Reality</p>
      </header>

      <form className="optimizer-top-bar" onSubmit={handleExecute}>
        <div className="inputs-inline-row">
          <div className="field-box"><label>Account</label>
            <select value={params.accountType} onChange={e => setParams({...params, accountType: e.target.value})}>
              <option value="TFSA">TFSA</option>
              <option value="NR">NR</option>
              <option value="FHSA">FHSA</option>
            </select>
          </div>
          <div className="field-box"><label>Max Beta</label>
            <input type="number" step="0.01" value={params.targetBeta}
                   onChange={e => setParams({...params, targetBeta: +e.target.value})}/>
          </div>
          <div className="field-box"><label>Min Yield (%)</label>
            <input type="number" step="0.01" value={params.minYield}
                   onChange={e => setParams({...params, minYield: +e.target.value})}/>
          </div>
          <div className="field-box"><label>Max P/E</label>
            <input type="number" value={params.maxPe} onChange={e => setParams({...params, maxPe: +e.target.value})}/>
          </div>
          <div className="field-box"><label>Max Vol (%)</label>
            <input type="number" value={params.maxVol} onChange={e => setParams({...params, maxVol: +e.target.value})}/>
          </div>
          <div className="field-box"><label>New Cash</label>
            <input type="number"
                   value={params.newCash === 0 && params.newCash.toString() === "" ? "" : params.newCash}
                   onChange={e => {
                     const val = e.target.value;

                     if (val === "" || val === "-") {
                       setParams({...params, newCash: val as any});
                       return;
                     }

                     const num = parseFloat(val);
                     if (!isNaN(num)) setParams({...params, newCash: num});
                   }}/>
          </div>
          <div className="field-box"><label>Force Cash</label>
            <input type="number" value={params.forceCash}
                   onChange={e => setParams({...params, forceCash: +e.target.value})}/>
          </div>
          <div className="field-box"><label>Scope Level</label>
            <select value={params.imntsScope} onChange={e => setParams({...params, imntsScope: e.target.value})}>
              <option value="ACCOUNT_LEVEL">ACCOUNT</option>
              <option value="PORTFOLIO_LEVEL">PORTFOLIO</option>
            </select>
          </div>
          <div className="field-box"><label>Objective</label>
            <select value={params.objectiveMode} onChange={e => setParams({...params, objectiveMode: e.target.value})}>
              <option value="MAX_RETURN">MAX RETURN</option>
              <option value="MAX_YIELD">MAX YIELD</option>
              <option value="BALANCED">BALANCED</option>
            </select>
          </div>
        </div>

        <div className="inputs-second-row">
          <div className="field-box ignore-field">
            <label>Ignore Instruments (Ticker|Ticker)</label>
            <input
              className="input-ignore-imnt"
              type="text"
              placeholder="e.g. SHOP.TO|TD.TO"
              value={params.ignoreImnts}
              onChange={e => setParams({...params, ignoreImnts: e.target.value.toUpperCase()})}
            />
          </div>
          <div className="field-box ignore-field">
            <label>Force Instruments (Ticker|Ticker)</label>
            <input
              className="input-ignore-imnt"
              type="text"
              placeholder="e.g. CM.TO|BNS.TO|CCO.TO"
              value={params.forceImnts}
              onChange={e => setParams({...params, forceImnts: e.target.value.toUpperCase()})}
            />
          </div>
          {/* Ensure this wrapper exists for the button */}
          <div className="button-field">
            <button type="submit" className="execute-btn">EXECUTE OPTIMIZER</button>
          </div>
        </div>
      </form>

      {/* STRATEGY SUMMARY HEADER */}
      {summary && (
        <div className="strategy-meta-display">
          <div className={`meta-card ${summary.status.toLowerCase() !== 'optimal' ? 'status-critical' : ''}`}>
            <span>STATUS</span><strong>{summary.status}</strong>
          </div>
          <div className="meta-card"><span>STRATEGY BETA</span><strong>{summary.beta}</strong></div>
          <div className="meta-card">
            <span>STRATEGY EPR</span><strong>{(parseFloat(summary.epr) * 100).toFixed(2)}%</strong></div>
          <div className="meta-card">
            <span>STRATEGY EPY</span><strong>{(parseFloat(summary.epy) * 100).toFixed(2)}%</strong></div>
          <div className="meta-card">
            <span>VOLATILITY</span><strong>{(parseFloat(summary.vol) * 100).toFixed(2)}%</strong></div>
          <div className="meta-card"><span>AVG P/E</span><strong>{summary.pe}</strong></div>
          <div className="meta-card"><span>SHARPE RATIO</span><strong>{parseFloat(summary.sharpe).toFixed(2)}</strong>
          </div>
        </div>
      )}

      {/* RESULTS TABLE */}
      <div className="table-container">
        <table className="optimizer-table">
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <span className="sort-icon">
                      {{asc: ' ▴', desc: ' ▾'}[header.column.getIsSorted() as string] ?? ' ↕'}
                    </span>
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrategyPortfolioOptimizerDashboard;