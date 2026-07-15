import {useEffect, useState} from "react";
import {Instrument, Portfolio} from "../../assets/proto/generated/MarketData.ts";
import {fetchAllRegisteredContributions} from "../../services/MarketPortfolioService.tsx";
import RegisteredContributionLedger, {RegisteredContributionRecord} from "./RegisteredContributionLedger.tsx";

/**
 * Robustly parses and separates standard contributions from the limit sentinel.
 */
const parseContributions = (instruments: Instrument[]) => {
  const contributions: RegisteredContributionRecord[] = [];
  let maxLimit = 0;

  for (const imnt of instruments) {
    // 1. Check if the entire Instrument is the sentinel
    const firstDate = imnt.ticker?.data?.[0]?.date;
    const firstPrice = imnt.ticker?.data?.[0]?.price || 0.0;

    if (firstDate === -1) {
      maxLimit = firstPrice;
      continue; // Skip appending the sentinel to actual contributions
    }

    // 2. Extract standard contributions
    const isGicVal = imnt.metaData?.get("isGic")?.toLowerCase() === "true";

    if (imnt.ticker?.data) {
      for (const dataPoint of imnt.ticker.data) {
        if (dataPoint.date === -1) {
          maxLimit = dataPoint.price; // Catch sentinel nested inside data points
        } else {
          contributions.push({
            symbol: imnt.ticker.symbol || "CONTRIBUTION",
            amount: dataPoint.price || 0.0,
            date: dataPoint.date,
            isGic: isGicVal,
          });
        }
      }
    }
  }

  return {contributions, maxLimit};
};

interface RegisteredContributionLedgerComponentProps {
  accountType: string; // e.g., "TFSA", "RRSP"
}

const RegisteredContributionLedgerComponent = ({accountType}: RegisteredContributionLedgerComponentProps) => {
  const [contributions, setContributions] = useState<RegisteredContributionRecord[]>([]);
  const [maxLimit, setMaxLimit] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchAllRegisteredContributions(accountType)
      .then(result => {
        if (!result) {
          throw new Error(`No contribution history found for ${accountType}`);
        }

        const binaryData = new Uint8Array(result);
        const portfolio: Portfolio = Portfolio.deserializeBinary(binaryData);

        const parsed = parseContributions(portfolio.instruments);
        setContributions(parsed.contributions);
        setMaxLimit(parsed.maxLimit);
      })
      .catch(err => {
        console.error("Error fetching registered contributions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accountType]);

  if (loading) {
    return (
      <div className="ledger-container" style={{textAlign: "center"}}>
        Syncing registration metrics...
      </div>
    );
  }

  return (
    <RegisteredContributionLedger
      accountType={accountType}
      contributions={contributions}
      maxLimit={maxLimit}
    />
  );
};

export default RegisteredContributionLedgerComponent;