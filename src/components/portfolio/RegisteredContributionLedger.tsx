import { useMemo, useState } from 'react';
import './RegisteredContributionLedger.css';

export interface RegisteredContributionRecord {
  symbol: string;
  amount: number;
  date: number; // YYYYMMDD format
  isGic: boolean;
}

interface RegisteredContributionLedgerProps {
  accountType: string;
  contributions: RegisteredContributionRecord[];
  maxLimit: number;
}

type GroupKey = 'year' | 'month';

interface AggregateRow {
  groupLabel: string;
  year?: string;
  month?: string;
  monthNum?: number;
  totalAmount: number;
  recordsCount: number;
  childRecords: RegisteredContributionRecord[]; // Shows underlying transactions
}

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

/**
 * Helper to format a YYYYMMDD number into a clean YYYY-MM-DD string
 */
const formatDateString = (dateNum: number): string => {
  const dateStr = dateNum.toString();
  if (dateStr.length !== 8) return dateStr; // Fallback if format is unexpected
  const yyyy = dateStr.slice(0, 4);
  const mm = dateStr.slice(4, 6);
  const dd = dateStr.slice(6, 8);
  return `${yyyy}-${mm}-${dd}`;
};

const RegisteredContributionLedger = ({ accountType, contributions, maxLimit }: RegisteredContributionLedgerProps) => {
  // Aggregate checkboxes (Removed GIC grouping to align with the left selectors)
  const [groupByYear, setGroupByYear] = useState<boolean>(true);
  const [groupByMonth, setGroupByMonth] = useState<boolean>(false);

  // High-level quick selector filters on the left
  const [filterType, setFilterType] = useState<'ALL' | 'GIC_ONLY' | 'MARKET_ONLY'>('ALL');

  // Enriched raw parsing helper
  const enrichedRecords = useMemo(() => {
    return contributions.map(record => {
      const dateStr = record.date.toString();
      const year = dateStr.slice(0, 4);
      const monthNum = parseInt(dateStr.slice(4, 6), 10);
      const month = MONTH_NAMES[monthNum - 1] || 'UNK';
      return {
        ...record,
        year,
        month,
        monthNum
      };
    });
  }, [contributions]);

  // Apply pre-aggregation filters
  const filteredRecords = useMemo(() => {
    if (filterType === 'GIC_ONLY') return enrichedRecords.filter(r => r.isGic);
    if (filterType === 'MARKET_ONLY') return enrichedRecords.filter(r => !r.isGic);
    return enrichedRecords;
  }, [enrichedRecords, filterType]);

  // Aggregate dynamically based on parameters
  const aggregatedData = useMemo(() => {
    const activeGroupKeys: GroupKey[] = [];
    if (groupByYear) activeGroupKeys.push('year');
    if (groupByMonth) activeGroupKeys.push('month');

    if (activeGroupKeys.length === 0) {
      return filteredRecords
        .map((rec, i) => {
          const formattedDate = formatDateString(rec.date);
          return {
            groupLabel: `Payment #${i + 1} (${formattedDate})`,
            year: rec.year,
            month: rec.month,
            monthNum: rec.monthNum,
            totalAmount: rec.amount,
            recordsCount: 1,
            childRecords: [rec]
          } as AggregateRow;
        })
        .sort((a, b) => {
          const idxA = filteredRecords.indexOf(a as any);
          const idxB = filteredRecords.indexOf(b as any);
          return (filteredRecords[idxB]?.date || 0) - (filteredRecords[idxA]?.date || 0);
        });
    }

    const groups: Record<string, AggregateRow> = {};

    filteredRecords.forEach(rec => {
      const keyParts: string[] = [];
      if (groupByYear) keyParts.push(rec.year);
      if (groupByMonth) keyParts.push(rec.month);

      const groupHashKey = keyParts.join(' | ');

      if (!groups[groupHashKey]) {
        groups[groupHashKey] = {
          groupLabel: groupHashKey,
          year: groupByYear ? rec.year : undefined,
          month: groupByMonth ? rec.month : undefined,
          monthNum: groupByMonth ? rec.monthNum : undefined,
          totalAmount: 0,
          recordsCount: 0,
          childRecords: []
        };
      }

      groups[groupHashKey].totalAmount += rec.amount;
      groups[groupHashKey].recordsCount += 1;
      groups[groupHashKey].childRecords.push(rec);
    });

    return Object.values(groups).sort((a, b) => {
      // 1. Sort by Year Descending
      if (groupByYear && a.year && b.year) {
        if (a.year !== b.year) return b.year.localeCompare(a.year);
      }
      // 2. Sort by Month Chronologically Descending
      if (groupByMonth && a.monthNum !== undefined && b.monthNum !== undefined) {
        if (a.monthNum !== b.monthNum) return b.monthNum - a.monthNum;
      }
      return 0;
    });
  }, [filteredRecords, groupByYear, groupByMonth]);

  // Global static summaries for KPI cards
  const totalContributedGlobal = useMemo(() => {
    return contributions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [contributions]);

  const utilizationPercentage = maxLimit > 0 ? (totalContributedGlobal / maxLimit) * 100 : 0;
  const contributionSpaceLeft = maxLimit - totalContributedGlobal;

  // Dynamic sum strictly based on current filters for table footer
  const totalContributedFiltered = useMemo(() => {
    return filteredRecords.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredRecords]);

  return (
    <div className="ledger-container">
      {/* Top Utilization KPI Banner (Always displays global absolute statistics) */}
      <div className="kpi-dashboard-row">
        <div className="kpi-card">
          <span className="kpi-label">TOTAL CONTRIBUTED</span>
          <span className="kpi-value">
            ${totalContributedGlobal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="kpi-card highlight-blue">
          <span className="kpi-label">{accountType} MAX LIMIT</span>
          <span className="kpi-value">
            ${maxLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={`kpi-card ${utilizationPercentage > 95 ? 'alert-loss' : 'alert-gain'}`}>
          <span className="kpi-label">UTILIZATION</span>
          <span className="kpi-value">{utilizationPercentage.toFixed(1)}%</span>
          <div className="kpi-progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(utilizationPercentage, 100)}%` }} />
          </div>
        </div>
        <div className="kpi-card highlight-green">
          <span className="kpi-label">SPACE REMAINING</span>
          <span className="kpi-value text-pos">
            ${contributionSpaceLeft.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="ledger-header-grid">
        {/* Quick Filter Selection */}
        <div className="toggle-wrapper">
          <button className={filterType === 'ALL' ? 'active' : ''} onClick={() => setFilterType('ALL')}>All</button>
          <button className={filterType === 'GIC_ONLY' ? 'active' : ''} onClick={() => setFilterType('GIC_ONLY')}>GIC</button>
          <button className={filterType === 'MARKET_ONLY' ? 'active' : ''} onClick={() => setFilterType('MARKET_ONLY')}>Market</button>
        </div>

        <div className="header-text-center">
          <h2>{accountType} Space Audit Ledger</h2>
          <p>Registration allocation history and room calculation tracker</p>
        </div>

        <div className="filter-toggle-right">
          <div className="aggregator-controls">
            <span className="control-label">Aggregate By:</span>
            
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={groupByYear}
                onChange={(e) => setGroupByYear(e.target.checked)}
              />
              <span className="custom-checkbox" />
              Year
            </label>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={groupByMonth}
                onChange={(e) => setGroupByMonth(e.target.checked)}
              />
              <span className="custom-checkbox" />
              Month
            </label>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ledger-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Grouping Key</th>
              {groupByYear && <th>Year</th>}
              {groupByMonth && <th>Month</th>}
              <th style={{ textAlign: 'right' }}>Contributed Amount</th>
              <th>Transaction Count</th>
              <th style={{ textAlign: 'left', paddingLeft: '24px' }}>Child Transactions</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedData.map((row, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left' }} className="group-label-text">
                  {row.groupLabel}
                </td>
                {groupByYear && <td>{row.year}</td>}
                {groupByMonth && <td>{row.month}</td>}
                <td style={{ textAlign: 'right' }} className="text-pos font-bold">
                  ${row.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>{row.recordsCount}</td>
                <td style={{ textAlign: 'left', paddingLeft: '24px' }}>
                  <div className="child-transactions-container">
                    {row.childRecords.map((child, childIdx) => (
                      <div 
                        className="child-tx-chip" 
                        key={childIdx}
                        title={`${formatDateString(child.date)}`} /* Added browser native tooltip */
                      >
                        <span className="child-amount">
                          ${child.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`mini-badge ${child.isGic ? 'gic' : 'mkt'}`}>
                          {child.isGic ? 'GIC' : 'Mkt'}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="ledger-footer">
            <tr>
              <td colSpan={1 + (groupByYear ? 1 : 0) + (groupByMonth ? 1 : 0)} className="footer-label">
                TOTAL DEPOSITED (FILTERED)
              </td>
              <td style={{ textAlign: 'right' }} className="footer-value text-pos">
                ${totalContributedFiltered.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RegisteredContributionLedger;
