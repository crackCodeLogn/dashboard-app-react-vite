import {useCallback, useEffect, useState} from 'react';
import {CorporateAction, Portfolio} from "../../assets/proto/generated/MarketData.ts";
import {fetchNewsCorporateActions} from "../../services/MarketPortfolioService.tsx";
import './PortfolioNewsCorpActionsComponent.css';

export interface CorpActionNewsData {
  imnt: string;
  corpActions: CorporateAction[];
}

const PortfolioNewsCorpActionsComponent = () => {
  const [corpActionNews, setCorpActionNews] = useState<CorpActionNewsData[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setErrorMsg('');
    try {
      const result = await fetchNewsCorporateActions();
      if (!result) throw new Error(`No data found.`);

      const binaryData = new Uint8Array(result);
      const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);

      const parsedData = portfolio.instruments
        .map(imnt => ({
          imnt: imnt.ticker.symbol,
          corpActions: imnt.corporateActions
        }))
        .filter(item => item.corpActions.length > 0);

      setCorpActionNews(parsedData);
    } catch (err) {
      // setErrorMsg(`Error corporate action news : ${err instanceof Error ? err.message : String(err)}`);
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
    } catch {
      return dateStr;
    }
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
              <th>Instrument</th>
              <th>Details</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Effective Date</th>
            </tr>
            </thead>
            <tbody>
            {corpActionNews.map((item) => (
              item.corpActions.map((action, index) => (
                <tr key={`${item.imnt}-${index}`}>
                  <td className="ticker-cell">
                    {index === 0 ? item.imnt : ''}
                  </td>
                  <td className="details-cell">
                    <div className="event-message">{action.message}</div>
                  </td>
                  <td>
                      <span
                        className={`badge ${action.metaEventType?.includes('DIVIDEND') ? 'badge-dividend' : 'badge-other'}`}>
                        {action.metaEventType || 'OTHER'}
                      </span>
                  </td>
                  <td className="amount-cell">
                    {action.metaAmount ? `$${action.metaAmount}` : '-'}
                  </td>
                  <td className="date-cell">
                    {formatDate(action.metaDate)}
                  </td>
                </tr>
              ))
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioNewsCorpActionsComponent;