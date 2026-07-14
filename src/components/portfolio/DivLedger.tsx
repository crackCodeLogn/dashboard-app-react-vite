import {useMemo, useState} from 'react';
import './DivLedger.css';

export interface DividendRecord {
  symbol: string;
  amount: number;
  accountType: string;
  date: number;        // YYYYMMDD format
}

type GroupKey = 'year' | 'month' | 'accountType' | 'symbol';

interface AggregateRow {
  groupLabel: string;
  year?: string;
  month?: string;
  monthNum?: number; // Kept internally for chronological sorting
  accountType?: string;
  symbol?: string;
  totalAmount: number;
  recordsCount: number;
  symbols: string[];
}

interface DivLedgerProps {
  dataPoints: DividendRecord[];
}

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const DivLedger = ({dataPoints}: DivLedgerProps) => {
  // Checkbox states for aggregation criteria
  const [groupByYear, setGroupByYear] = useState<boolean>(true);
  const [groupByMonth, setGroupByMonth] = useState<boolean>(false);
  const [groupByAccount, setGroupByAccount] = useState<boolean>(false);
  const [groupBySymbol, setGroupBySymbol] = useState<boolean>(false);

  // Enriched records extract parsed variables for clean mapping
  const enrichedRecords = useMemo(() => {
    return dataPoints.map(record => {
      const dateStr = record.date.toString();
      const year = dateStr.slice(0, 4);
      const monthNum = parseInt(dateStr.slice(4, 6), 10);
      const month = MONTH_NAMES[monthNum - 1] || 'Unknown';
      return {
        ...record,
        year,
        month,
        monthNum
      };
    });
  }, [dataPoints]);

  // Compute aggregated rows based on current active checkbox parameters
  const aggregatedData = useMemo(() => {
    const activeGroupKeys: GroupKey[] = [];
    if (groupByYear) activeGroupKeys.push('year');
    if (groupByMonth) activeGroupKeys.push('month');
    if (groupByAccount) activeGroupKeys.push('accountType');
    if (groupBySymbol) activeGroupKeys.push('symbol');

    // If no grouping checkboxes are selected, treat every entry as its own unique record
    if (activeGroupKeys.length === 0) {
      return enrichedRecords
        .map((rec, i) => {
          const dateStr = rec.date.toString();
          const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
          return {
            groupLabel: `Record #${i + 1} (${formattedDate})`,
            year: rec.year,
            month: rec.month,
            monthNum: rec.monthNum,
            accountType: rec.accountType,
            symbol: rec.symbol,
            totalAmount: rec.amount,
            recordsCount: 1,
            symbols: [rec.symbol]
          } as AggregateRow;
        })
        .sort((a, b) => {
          // Default fall-back sort when raw: chronological desc (recent first)
          const dateA = dataPoints[enrichedRecords.indexOf(a as any)]?.date || 0;
          const dateB = dataPoints[enrichedRecords.indexOf(b as any)]?.date || 0;
          return dateB - dateA;
        });
    }

    const groups: Record<string, AggregateRow> = {};

    enrichedRecords.forEach(rec => {
      const keyParts: string[] = [];
      if (groupByYear) keyParts.push(rec.year);
      if (groupByMonth) keyParts.push(rec.month);
      if (groupByAccount) keyParts.push(rec.accountType);
      if (groupBySymbol) keyParts.push(rec.symbol);

      const groupHashKey = keyParts.join(' | ');

      if (!groups[groupHashKey]) {
        groups[groupHashKey] = {
          groupLabel: groupHashKey,
          year: groupByYear ? rec.year : undefined,
          month: groupByMonth ? rec.month : undefined,
          monthNum: groupByMonth ? rec.monthNum : undefined,
          accountType: groupByAccount ? rec.accountType : undefined,
          symbol: groupBySymbol ? rec.symbol : undefined,
          totalAmount: 0,
          recordsCount: 0,
          symbols: []
        };
      }

      groups[groupHashKey].totalAmount += rec.amount;
      groups[groupHashKey].recordsCount += 1;
      if (!groups[groupHashKey].symbols.includes(rec.symbol)) {
        groups[groupHashKey].symbols.push(rec.symbol);
      }
    });

    // Convert values to array and apply rigid hierarchical sorting rules
    return Object.values(groups)
      .map(row => {
        // Sort the nested ticker names alphabetically for display consistency inside the pills
        return {
          ...row,
          symbols: [...row.symbols].sort((a, b) => a.localeCompare(b))
        };
      })
      .sort((a, b) => {
        // Rule 1: Always sort by Year (Descending - Most recent first)
        if (groupByYear && a.year && b.year) {
          if (a.year !== b.year) {
            return b.year.localeCompare(a.year); // Descending
          }
        }

        // Rule 2: Sort by Month within the Year (Descending - December to January)
        if (groupByMonth && a.monthNum !== undefined && b.monthNum !== undefined) {
          if (a.monthNum !== b.monthNum) {
            return b.monthNum - a.monthNum; // Descending
          }
        }

        // Rule 3: Sort by Account Type alphabetically (Ascending - e.g., NON_REG, RRSP, TFSA)
        if (groupByAccount && a.accountType && b.accountType) {
          if (a.accountType !== b.accountType) {
            return a.accountType.localeCompare(b.accountType); // Ascending
          }
        }

        // Rule 4: Sort by Symbol alphabetically (Ascending)
        if (groupBySymbol && a.symbol && b.symbol) {
          if (a.symbol !== b.symbol) {
            return a.symbol.localeCompare(b.symbol); // Ascending
          }
        }

        return 0;
      });
  }, [enrichedRecords, groupByYear, groupByMonth, groupByAccount, groupBySymbol, dataPoints]);

  const grandTotal = useMemo(() => {
    return dataPoints.reduce((acc, curr) => acc + curr.amount, 0);
  }, [dataPoints]);

  return (
    <div className="ledger-container">
      <div className="ledger-header-grid">
        <div/>

        <div className="header-text-center">
          <h2>Dividend Ledger</h2>
          <p>Multi-dimensional aggregation dashboard</p>
        </div>

        {/* Aggregation Control Panel */}
        <div className="filter-toggle-right">
          <div className="aggregator-controls">
            <span className="control-label">Aggregate By:</span>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={groupByYear}
                onChange={(e) => setGroupByYear(e.target.checked)}
              />
              <span className="custom-checkbox"/>
              Year
            </label>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={groupByMonth}
                onChange={(e) => setGroupByMonth(e.target.checked)}
              />
              <span className="custom-checkbox"/>
              Month
            </label>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={groupByAccount}
                onChange={(e) => setGroupByAccount(e.target.checked)}
              />
              <span className="custom-checkbox"/>
              Account
            </label>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={groupBySymbol}
                onChange={(e) => setGroupBySymbol(e.target.checked)}
              />
              <span className="custom-checkbox"/>
              Symbol
            </label>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ledger-table">
          <thead>
          <tr>
            <th style={{textAlign: 'left'}}>Grouping Key</th>
            {groupByYear && <th>Year</th>}
            {groupByMonth && <th>Month</th>}
            {groupByAccount && <th>Account</th>}
            {groupBySymbol && <th>Symbol</th>}
            <th style={{textAlign: 'right'}}>Total Amount</th>
            <th>Div Count</th>
            <th style={{textAlign: 'center'}}>Source Symbols</th>
          </tr>
          </thead>
          <tbody>
          {aggregatedData.map((row, index) => (
            <tr key={index}>
              <td style={{textAlign: 'left'}} className="group-label-text">
                {row.groupLabel}
              </td>
              {groupByYear && <td>{row.year}</td>}
              {groupByMonth && <td>{row.month}</td>}
              {groupByAccount && <td>{row.accountType}</td>}
              {groupBySymbol && <td className="symbol-text">{row.symbol}</td>}
              <td style={{textAlign: 'right'}} className="text-pos font-bold">
                ${row.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
              <td>{row.recordsCount}</td>
              <td>
                <div className="symbol-pill-container" style={{justifyContent: 'center'}}>
                  {row.symbols.map(sym => (
                    <span key={sym} className="symbol-pill">{sym}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
          </tbody>
          <tfoot className="ledger-footer">
          <tr>
            {/* Span columns to align the Grand Total accurately beneath Total Amount */}
            <td
              colSpan={1 + (groupByYear ? 1 : 0) + (groupByMonth ? 1 : 0) + (groupByAccount ? 1 : 0) + (groupBySymbol ? 1 : 0)}
              className="footer-label">
              GRAND TOTAL DIVIDENDS
            </td>
            <td style={{textAlign: 'right'}} className="footer-value text-pos">
              ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            {/* Match the remaining trailing columns (Div Count, Source Symbols) */}
            <td colSpan={2}></td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DivLedger;