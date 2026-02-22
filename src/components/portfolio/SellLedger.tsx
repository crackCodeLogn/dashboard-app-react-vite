import {useMemo, useState} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import './SellLedger.css';
import {AccountType} from "../../assets/proto/generated/MarketData.ts";

export interface SellRecord {
  symbol: string;
  date: number; // YYYYMMDD format
  accountType: AccountType;
  quantity: number;
  pnL: number;
  pricePerShare: number;
  preAcbTotal: number;
  preAcbUnit: number;
  soldPrice: number;
  currentAcbTotal: number;
  currentAcbUnit: number;
  closingPosition: boolean;
}

const columnHelper = createColumnHelper<SellRecord>();

const SellLedger = (props: { dataPoints: SellRecord[] }) => {
  const [sorting, setSorting] = useState<SortingState>([{id: 'date', desc: true}]);
  const [filterMode, setFilterMode] = useState<'ALL' | 'YTD'>('ALL');

  const filteredData = useMemo(() => {
    if (filterMode === 'ALL') return props.dataPoints;
    const currentYear = new Date().getFullYear();
    return props.dataPoints.filter(record => Math.floor(record.date / 10000) === currentYear);
  }, [props.dataPoints, filterMode]);

  const columns = useMemo(() => [
    columnHelper.accessor('symbol', {
      header: 'Symbol',
      cell: info => <span className="symbol-text">{info.getValue()}</span>,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => {
        const s = info.getValue().toString();
        return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
      },
    }),
    columnHelper.accessor('accountType', {
      header: 'Account',
      cell: info => AccountType[info.getValue()]
    }),
    columnHelper.accessor('quantity', {
      header: 'Qty',
      cell: info => info.getValue().toLocaleString()
    }),
    columnHelper.accessor('soldPrice', {
      header: 'Sell Price',
      cell: info => `$${info.getValue().toFixed(2)}`
    }),
    columnHelper.accessor('pnL', {
      header: 'Gain/Loss',
      cell: info => {
        const val = info.getValue();
        return (
          <span className={`pnl-badge ${val >= 0 ? 'pos' : 'neg'}`}>
            {val >= 0 ? '+' : ''}{val.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </span>
        );
      },
    }),
    columnHelper.accessor('preAcbUnit', {
      header: 'Pre-ACB/u',
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('currentAcbTotal', {
      header: 'Rem. ACB',
      cell: info => `$${info.getValue().toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    }),
    columnHelper.accessor('closingPosition', {
      header: 'Status',
      cell: info => (
        <span className={`status-tag ${info.getValue() ? 'closed' : 'partial'}`}>
          {info.getValue() ? 'Closed' : 'Open'}
        </span>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {sorting},
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalPnL = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.pnL, 0);
  }, [filteredData]);

  return (
    <div className="ledger-container">
      <div className="ledger-header-grid">
        {/* Left column empty to balance the grid */}
        <div/>

        <div className="header-text-center">
          <h2>Realized Gain/Loss Ledger</h2>
          <p>Historical sell records and adjusted cost base tracking</p>
        </div>

        <div className="filter-toggle-right">
          <div className="toggle-wrapper">
            <button
              className={filterMode === 'ALL' ? 'active' : ''}
              onClick={() => setFilterMode('ALL')}
            >
              All-Time
            </button>
            <button
              className={filterMode === 'YTD' ? 'active' : ''}
              onClick={() => setFilterMode('YTD')}
            >
              Year-to-Date
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ledger-table">
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isSorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={isSorted ? 'active-sort' : ''}
                  >
                    <div className="header-content">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="sort-indicator">
                          {{asc: ' 🔼', desc: ' 🔽'}[isSorted as string] ?? ' ↕️'}
                        </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
          <tfoot className="ledger-footer">
          <tr>
            <td colSpan={5} className="footer-label">TOTAL REALIZED PNL</td>
            <td className={`footer-value ${totalPnL >= 0 ? 'text-pos' : 'text-neg'}`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </td>
            <td colSpan={3}></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SellLedger;