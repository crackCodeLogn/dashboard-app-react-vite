import React, {useCallback, useEffect, useState} from 'react';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {fetchAccountMarketSectorValuationsData} from '../../services/MarketPortfolioService.tsx';
import {DataPacket} from '../../assets/proto/generated/DataPacket.ts';
import CustomError from '../error/CustomError.tsx';
import {Utils} from '../../utils/Utils.tsx';
import './PortfolioMarketAccountValuationSectorPieChart.css'; // Dedicated CSS file
import Table from "react-bootstrap/Table"; // Import Table component

// Define the structure for the chart data
export interface SectorValuation {
  name: string; // Sector name
  value: number; // Valuation amount
}

// Color palette for the pie chart sectors
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AF19FF', '#FF4560', '#546E7A', '#7CFC00',
];

const PortfolioMarketSectorPieChartComponent = (props: { accountType: string; limit: number }) => {
  const {accountType, limit} = props;

  // State for the data used in the chart (limited + 'Other')
  const [chartData, setChartData] = useState<SectorValuation[] | null>(null);

  // State for ALL sectors (used in the detailed table)
  const [fullSectorData, setFullSectorData] = useState<SectorValuation[] | null>(null);

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

      let sectorValuations: SectorValuation[] = [];
      let total = 0.0;

      // 2. Map Processing
      for (const entry of dataPacket.stringDoubleMap.entries()) {
        sectorValuations.push({name: entry[0], value: entry[1]});
        total += entry[1];
      }

      // Sort the data
      sectorValuations.sort((a, b) => b.value - a.value);

      // --- Prepare Data for Chart (Limited) ---
      const topSectors = sectorValuations.slice(0, Math.min(sectorValuations.length, limit));
      const otherSectors = sectorValuations.slice(limit);

      let finalChartData = [...topSectors]; // Use spread to avoid mutation
      if (otherSectors.length > 0) {
        const otherValue = otherSectors.reduce((sum, item) => sum + item.value, 0);
        finalChartData.push({name: `Other (${otherSectors.length} Sectors)`, value: otherValue});
      }

      // --- Update State ---
      setTotalValue(total);
      setChartData(finalChartData);
      setFullSectorData(sectorValuations); // Store ALL data for the detail table

    } catch (err) {
      console.error(err);
      setErrorMsg(`Error fetching sector data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [accountType, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Custom Tooltip component for formatting
  const CustomTooltip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalValue > 0 ? ((data.value / totalValue) * 100).toFixed(2) : 0;
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
  if (errorMsg || (fullSectorData && fullSectorData.length === 0)) {
    return <CustomError errorMsg={errorMsg || 'No Sector Valuation data available to display.'}/>;
  }

  if (!fullSectorData || !chartData) {
    return <div>Loading Sector Data...</div>;
  }

  // Detailed Sector Table Component
  const DetailSectorTable = () => (
    <div className="detail-table-container">
      <Table bordered hover variant={'light'} className={"table-sector-detail"}>
        <thead>
        <tr>
          <th colSpan={2}>All Sectors ({fullSectorData.length})</th>
        </tr>
        <tr>
          <th>Sector</th>
          <th>% Total</th>
        </tr>
        </thead>
        <tbody>
        {fullSectorData.map((sector, index) => {
          const percentage = totalValue > 0 ? ((sector.value / totalValue) * 100).toFixed(2) : 0;
          return (
            <tr key={sector.name}>
              <td className={index < limit ? 'cell-strong' : ''}>{sector.name}</td>
              <td>{percentage}%</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div className="pie-chart-container">
      <h2>Sector Breakdown: {accountType}</h2>
      <p className="total-label">Total Value: <span className="cell-strong color-investment">{Utils.formatDollar(totalValue)}</span></p>

      {/* Container for the Pie Chart + Detail Table */}
      <div className="chart-and-table-flex">

        {/* Pie Chart and Legend */}
        <div className="pie-chart-area">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
                label={({name, percent}) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                paddingAngle={2}
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip totalValue={totalValue}/>}/>
              {/* NOTE: Legend is often better placed outside the PieChart component for custom control */}
            </PieChart>
          </ResponsiveContainer>
          <Legend
            payload={chartData.map((item, index) => ({
              value: item.name,
              type: 'square',
              id: item.name,
              color: COLORS[index % COLORS.length]
            }))}
            layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{paddingTop: '20px'}}
          />
        </div>

        {/* Detail Table */}
        <DetailSectorTable/>

      </div>
    </div>
  );
};

export default PortfolioMarketSectorPieChartComponent;