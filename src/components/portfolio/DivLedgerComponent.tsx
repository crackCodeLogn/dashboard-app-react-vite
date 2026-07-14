import {useEffect, useState} from "react";
import {AccountType, Instrument, Portfolio} from "../../assets/proto/generated/MarketData.ts";
import DivLedger, {DividendRecord} from "./DivLedger.tsx";
import {fetchAllDividends} from "../../services/MarketPortfolioService.tsx";

/**
 * Parses the deserialized Protocol Buffer instruments into a clean local format
 * optimized for multi-dimensional checkbox aggregation.
 */
const parseDividendRecords = (instruments: Instrument[]): DividendRecord[] => {
  const records: DividendRecord[] = [];

  for (const imnt of instruments) {
    // Resolve the account type name from the generated proto Enum, defaulting to string if matching fails
    const resolvedAccountType = AccountType[imnt.accountType] || "UNKNOWN"; 

    records.push({
      symbol: imnt.ticker.symbol,
      amount: imnt.ticker.data[0]?.price || 0.0,
      accountType: resolvedAccountType,
      date: imnt.ticker.data[0]?.date || 19700101, // YYYYMMDD integer format
    });
  }

  return records;
};

const DivLedgerComponent = () => {
  const [divRecords, setDivRecords] = useState<DividendRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchAllDividends() 
      .then(result => {
        if (!result) {
          throw new Error(`No dividend record data found`);
        }

        // Proto deserialization mirror
        const binaryData = new Uint8Array(result);
        const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);

        setDivRecords(parseDividendRecords(portfolio.instruments));
      })
      .catch(err => {
        console.error("Error fetching dividend details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="ledger-container" style={{textAlign: 'center'}}>Loading dividend portfolio data...</div>;
  }

  return (
    <>
      <DivLedger dataPoints={divRecords}/>
    </>
  );
};

export default DivLedgerComponent;