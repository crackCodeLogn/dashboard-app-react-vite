import {useCallback, useEffect, useMemo, useState} from 'react';
import {Portfolio} from "../../assets/proto/generated/MarketData.ts";
import {fetchNewsCorporateActions} from "../../services/MarketPortfolioService.tsx";
import './PortfolioNewsCorpActionsComponent.css';

export interface FlatCorpAction {
  ticker: string;
  message: string;
  type: string;
  amount: number;
  date: string;
  rawDate: number; // Used for accurate chronological sorting
}

type SortConfig = {
  key: keyof FlatCorpAction;
  direction: 'asc' | 'desc';
} | null;

const PortfolioNewsCorpActionsComponent = () => {
  const [flatData, setFlatData] = useState<FlatCorpAction[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'rawDate', direction: 'asc'});
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setErrorMsg('');
    try {
      const result = await fetchNewsCorporateActions();
      if (!result) throw new Error(`No data found.`);

      const binaryData = new Uint8Array(result);
      const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);

      // Flatten the data for easier sorting
      const flattened: FlatCorpAction[] = [];
      portfolio.instruments.forEach(imnt => {
        imnt.corporateActions.forEach(action => {
          flattened.push({
            ticker: imnt.ticker.symbol,
            message: action.message || '',
            type: action.metaEventType || 'OTHER',
            amount: action.metaAmount ? parseFloat(action.metaAmount) : 0,
            date: action.metaDate || '',
            rawDate: action.metaDate ? new Date(action.metaDate).getTime() : 0
          });
        });
      });

      setFlatData(flattened);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized sorting logic
  const sortedData = useMemo(() => {
    const sortableItems = [...flatData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [flatData, sortConfig]);

  const requestSort = (key: keyof FlatCorpAction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({key, direction});
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
  };

  const getSortIcon = (key: keyof FlatCorpAction) => {
    if (sortConfig?.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '🔼' : '🔽';
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-inner">
        <h2 className="portfolio-title">Portfolio Corporate Actions</h2>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <div className="table-wrapper">
          <table className="corp-action-table">
            <thead>
            <tr>
              <th onClick={() => requestSort('ticker')} className="sortable-header">
                Imnt {getSortIcon('ticker')}
              </th>
              <th onClick={() => requestSort('message')} className="sortable-header">
                Details {getSortIcon('message')}
              </th>
              <th onClick={() => requestSort('type')} className="sortable-header">
                Type {getSortIcon('type')}
              </th>
              <th onClick={() => requestSort('amount')} className="sortable-header">
                Amount {getSortIcon('amount')}
              </th>
              <th onClick={() => requestSort('rawDate')} className="sortable-header">
                Effective Date {getSortIcon('rawDate')}
              </th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((item, index) => (
              <tr key={`${item.ticker}-${index}`}>
                <td className="ticker-cell">{item.ticker}</td>
                <td className="details-cell">
                  <div className="event-message">{item.message}</div>
                </td>
                <td>
                    <span className={`badge ${item.type.includes('DIVIDEND') ? 'badge-dividend' : 'badge-other'}`}>
                      {item.type}
                    </span>
                </td>
                <td className="amount-cell">
                  {item.amount !== 0 ? `$${item.amount.toFixed(2)}` : '-'}
                </td>
                <td className="date-cell">
                  {formatDate(item.date)}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioNewsCorpActionsComponent;