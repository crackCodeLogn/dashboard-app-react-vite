import React, {useCallback, useEffect, useState} from 'react';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {fetchAccountMarketSectorValuationsData} from '../../services/MarketPortfolioService.tsx'; // Assumed path
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts'; // Assumed path
import CustomError from '../error/CustomError.tsx';
import {Utils} from '../../utils/Utils.tsx'; // For formatting dollar amounts
import './PortfolioMarketAccountValuationSectorPieChart.css'; // Dedicated CSS file

// Define the structure for the chart data
export interface SectorValuation {
  name: string; // Sector name
  value: number; // Valuation amount
}

// Color palette for the pie chart sectors (add more as needed)
const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Yellow
  '#FF8042', // Orange
  '#AF19FF', // Purple
  '#FF4560', // Red-Orange
  '#546E7A', // Gray-Blue
  '#7CFC00', // Neon Green
];

const PortfolioMarketAccountValuationSectorPieChartComponent = (props: { accountType: string; limit: number }) => {
  const {accountType, limit} = props;
  const [sectorValuationData, setSectorValuationData] = useState<SectorValuation[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [totalValue, setTotalValue] = useState(0.0);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchAccountMarketSectorValuationsData(accountType);

      if (!result) {
        throw new Error(`No market sector valuation data found for ${accountType}`);
      }

      // 1. Protobuf Deserialization
      const binaryData = new Uint8Array(result);
      const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);

      const sectorValuations: SectorValuation[] = [];
      let total = 0.0;

      // 2. Map Processing
      for (const entry of dataPacket.stringDoubleMap.entries()) {
        const sector = entry[0];
        const value = entry[1];
        sectorValuations.push({name: sector, value: value});
        total += value;
      }

      // 3. Sort and Limit
      sectorValuations.sort((a, b) => b.value - a.value);

      // Separate the top sectors and group the rest into an "Other" category
      const topSectors = sectorValuations.slice(0, Math.min(sectorValuations.length, limit));
      const otherSectors = sectorValuations.slice(limit);

      let finalData = topSectors;
      if (otherSectors.length > 0) {
        const otherValue = otherSectors.reduce((sum, item) => sum + item.value, 0);
        finalData.push({name: `Other (${otherSectors.length} Sectors)`, value: otherValue});
      }

      setTotalValue(total);
      setSectorValuationData(finalData);

    } catch (err) {
      console.error(err);
      setErrorMsg(`Error fetching sector data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [accountType, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Custom Tooltip component for formatting (optional, but highly recommended)
  const CustomTooltip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(2);
      return (
        <div className="custom-tooltip">
          <p className="label">{`${data.name}: ${Utils.formatDollar(data.value)}`}</p>
          <p className="intro">{`${percentage}% of Total`}</p>
        </div>
      );
    }
    return null;
  };

  // Render Logic
  if (errorMsg || (sectorValuationData && sectorValuationData.length === 0)) {
    return <CustomError errorMsg={errorMsg || 'No Sector Valuation data available to display.'}/>;
  }

  if (!sectorValuationData) {
    // Basic loading state or just return null/empty div
    return <div>Loading Sector Data...</div>;
  }

  return (
    <div className="pie-chart-container">
      <h2>Sector Breakdown: {accountType}</h2>
      <p className="total-label">Total Value: <span className="cell-strong color-investment">{Utils.formatDollar(totalValue)}</span></p>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={sectorValuationData}
            dataKey="value"
            nameKey="name"
            cx="50%" // Center X position
            cy="50%" // Center Y position
            outerRadius={100}
            fill="#8884d8"
            labelLine={false}
            // Use a simple function for labels outside the slices
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            paddingAngle={2} // Small gap between slices
          >
            {sectorValuationData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip totalValue={totalValue}/>}/>
          <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{paddingLeft: '20px'}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioMarketAccountValuationSectorPieChartComponent;