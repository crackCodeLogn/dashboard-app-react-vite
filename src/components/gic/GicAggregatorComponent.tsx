import React, {useEffect, useMemo, useState} from 'react';
import './GicAggregator.css';
import {fetchGicExpiriesData} from "../../services/GicDataService.tsx";
import {AccountType, FixedDepositList} from "../../assets/proto/generated/FixedDeposit.ts";
import {GicRecord} from "./GicRecord.tsx";
import {Utils} from "../../utils/Utils.tsx";

// --- TYPES AND INTERFACES ---
type AggregationOption = 'All' | string;
type GicKey = keyof GicRecord;
type SortDirection = 'asc' | 'desc';

interface AggregatedInfo {
  totalDeposit: number;
  totalInterest: number;
  totalAmount: number;
  count: number;
  filteredRecords: GicRecord[];
}

interface SortState {
  key: GicKey;
  direction: SortDirection;
}

// --- HELPER FUNCTIONS ---

const getUniqueValues = (data: GicRecord[], key: GicKey): AggregationOption[] => {
  const values = new Set(data.map((item) => item[key] as string));
  return ['All', ...Array.from(values)];
};

const aggregateGics = (data: GicRecord[], ifsc: AggregationOption, type: AggregationOption): AggregatedInfo => {
  const filteredData = data.filter((gic) => {
    const ifscMatch = ifsc === 'All' || gic.ifsc === ifsc;
    const typeMatch = type === 'All' || gic.type === type;
    return ifscMatch && typeMatch;
  });

  const aggregation = filteredData.reduce((acc, current) => ({
    totalDeposit: acc.totalDeposit + current.deposit,
    totalInterest: acc.totalInterest + current.interest,
    totalAmount: acc.totalAmount + current.amount,
    count: acc.count + 1,
  }), {
    totalDeposit: 0,
    totalInterest: 0,
    totalAmount: 0,
    count: 0,
  });

  return {...aggregation, filteredRecords: filteredData};
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'}).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString || dateString.length !== 8) {
    return dateString; // Return original if not in expected format
  }
  // Convert yyyyMMdd (e.g., 20230101) to yyyy-MM-dd (2023-01-01) for reliable parsing
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  return `${year}-${month}-${day}`;

  // const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'short', day: 'numeric'};
  // return new Date(formattedDateString).toLocaleDateString(undefined, options);
}

/**
 * Custom sort function to handle strings, numbers, and dates.
 */
const sortRecords = (data: GicRecord[], sort: SortState): GicRecord[] => {
  if (!sort.key) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sort.key];
    const bValue = b[sort.key];

    let comparison: number;

    // Numeric comparison (for deposit, roi, interest, amount)
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }
    // String comparison (for number, ifsc, type, start and end date)
    else {
      comparison = (aValue as string).localeCompare(bValue as string);
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
};


// --- COMBINED COMPONENT ---

const GicAggregatorCombined: React.FC = () => {
  // Data state (moved from GicAggregatorComponent)
  const [gicData, setGicRecords] = useState<GicRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  // UI state (moved from GicAggregatorDisplayComponent)
  const [selectedIfsc, setSelectedIfsc] = useState<AggregationOption>('All');
  const [selectedType, setSelectedType] = useState<AggregationOption>('All');
  const [sortState, setSortState] = useState<SortState>({key: 'endDate', direction: 'asc'}); // Default sort

  // Data Fetching useEffect
  useEffect(() => {
    fetchGicExpiriesData()
      .then(result => {
        if (!result) {
          throw new Error(`no gic expiry data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const gicList: FixedDepositList = FixedDepositList.deserializeBinary(binaryData);
        const records: GicRecord[] = [];
        gicList.FixedDeposit.map(gic => {
          const gicRecord: GicRecord = {
            number: gic.fdNumber,
            ifsc: gic.bankIFSC,
            startDate: gic.startDate,
            endDate: gic.endDate,
            type: AccountType[gic.accountType],
            deposit: gic.depositAmount,
            roi: gic.rateOfInterest,
            interest: gic.expectedInterest,
            amount: gic.expectedAmount
          };
          records.push(gicRecord);
        });
        setGicRecords(records);
        setIsLoading(false); // Data loaded
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false); // Stop loading even on error
      });
  }, []); // Empty dependency array ensures it runs once on mount


  // Dynamically get unique IFSCs and Types (Memoized)
  const uniqueIfscs = useMemo(() => getUniqueValues(gicData, 'ifsc'), [gicData]);
  const uniqueTypes = useMemo(() => getUniqueValues(gicData, 'type'), [gicData]);

  // 1. Calculate aggregated data and get filtered records (Memoized)
  const aggregatedData = useMemo(() => {
    return aggregateGics(gicData, selectedIfsc, selectedType);
  }, [gicData, selectedIfsc, selectedType]);

  // 2. Apply sorting to the filtered records (Memoized)
  const sortedRecords = useMemo(() => {
    return sortRecords(aggregatedData.filteredRecords, sortState);
  }, [aggregatedData.filteredRecords, sortState]);

  const {totalDeposit, totalInterest, totalAmount, count} = aggregatedData;

  // Handler functions
  const handleSort = (key: GicKey) => {
    setSortState(prev => {
      let direction: SortDirection = 'asc';
      if (prev.key === key) {
        direction = prev.direction === 'asc' ? 'desc' : 'asc';
      }
      return {key, direction};
    });
  };

  const getSortIndicator = (key: GicKey) => {
    if (sortState.key !== key) return '↕️';
    return sortState.direction === 'asc' ? '⬆️' : '⬇️';
  };

  const headers: { label: string; key: GicKey; className?: string }[] = [
    {label: 'GIC #', key: 'number'},
    {label: 'IFSC', key: 'ifsc'},
    {label: 'Type', key: 'type'},
    {label: 'Start', key: 'startDate'},
    {label: 'End', key: 'endDate'},
    {label: 'Deposit', key: 'deposit', className: 'numeric'},
    {label: 'ROI', key: 'roi', className: 'numeric'},
    {label: 'Amount', key: 'amount', className: 'numeric'},
    {label: 'Interest', key: 'interest', className: 'numeric'},
  ];

  // Render Logic
  if (isLoading) {
    return (
      <div className="gic-aggregator-container loading">
        <h2>GIC Aggregation and Detail Viewer 📑</h2>
        <p className="loading-message">Loading GIC Data... Please wait.</p>
      </div>
    );
  }

  return (
    <div className="gic-aggregator-container">
      <h2>GIC Aggregation and Detail Viewer 📑</h2>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="ifsc-select">Filter by Bank (IFSC):</label>
          <select
            id="ifsc-select"
            value={selectedIfsc}
            onChange={(e) => setSelectedIfsc(e.target.value)}
          >
            {uniqueIfscs.map((ifsc) => (
              <option key={ifsc} value={ifsc}>
                {ifsc}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="type-select">Filter by Type:</label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="aggregation-summary">
        <h3>Aggregation Details</h3>
        <p className="filter-display">
          Showing data for: <strong>{selectedIfsc}</strong> (Bank) and <strong>{selectedType}</strong> (Type)
        </p>

        <div className="summary-cards">
          <div className="card count-card">
            <h4>Total GICs</h4>
            <p>{count}</p>
          </div>
          <div className="card deposit-card">
            <h4>Total Deposit (Principal)</h4>
            <p>{formatCurrency(totalDeposit)}</p>
          </div>
          <div className="card interest-card">
            <h4>Total Earned Interest</h4>
            <p>{formatCurrency(totalInterest)}</p>
          </div>
          <div className="card amount-card">
            <h4>Total Matured Amount</h4>
            <p>{formatCurrency(totalAmount)}</p>
          </div>
          <div className="card amount-roi">
            <h4>Overall ROI</h4>
            <p>{Utils.getPercentage(totalInterest, totalDeposit)}</p>
          </div>
        </div>
      </div>

      <div className="gic-details-table">
        <h3>Individual GIC Records ({count} Found)</h3>
        {count > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    onClick={() => handleSort(header.key)}
                    className={`${header.className || ''} sortable`}
                  >
                    {header.label}
                    <span className="sort-indicator">
                        {getSortIndicator(header.key)}
                      </span>
                  </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {sortedRecords.map((gic) => (
                <tr
                  key={gic.number}
                  className={gic.type === 'TFSA' ? 'gic-tfsa-row' : ''}
                >
                  <td>{gic.number}</td>
                  <td>{gic.ifsc}</td>
                  <td>{gic.type}</td>
                  <td>{formatDate(gic.startDate)}</td>
                  <td>{formatDate(gic.endDate)}</td>
                  <td className="numeric">{formatCurrency(gic.deposit)}</td>
                  <td className="numeric">{Utils.yValueFormat(gic.roi)}%</td>
                  <td className="numeric-strong">{formatCurrency(gic.amount)}</td>
                  <td className="numeric">{formatCurrency(gic.interest)}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No GIC records found for the current selection.</p>
        )}
      </div>
    </div>
  );
};

export default GicAggregatorCombined;