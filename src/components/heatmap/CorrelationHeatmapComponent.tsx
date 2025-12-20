import {HeatMapCanvas} from '@nivo/heatmap'
import {useMemo, useState} from "react";

// ---- Types ----
export interface CorrelationEntry {
  instrument1: string
  instrument2: string
  value: number // expected range: [-1, 1]
}

interface CorrelationHeatmapProps {
  data: CorrelationEntry[]
  min?: number // default -1
  max?: number // default 1
}

export interface NivoHeatmapSeries {
  id: string
  data: {
    x: string
    y: number | null
  }[]
}

export function convertCorrelationToNivoSeries(data: CorrelationEntry[]): NivoHeatmapSeries[] {
  const instruments = Array.from(new Set(data.flatMap(d => [d.instrument1, d.instrument2]))).sort();
  const valueMap = new Map<string, number>();

  data.forEach(({instrument1, instrument2, value}) => {
    valueMap.set(`${instrument1}::${instrument2}`, value);
    valueMap.set(`${instrument2}::${instrument1}`, value); // Ensure symmetry
  });

  return instruments.map(row => ({
    id: row,
    data: instruments.map(col => ({
      x: col,
      y: row === col ? 1 : (valueMap.get(`${row}::${col}`) ?? 0),
    })),
  }));
}

export default function CorrelationHeatmap({
                                             data,
                                             min = -1,
                                             max = 1,
                                           }: CorrelationHeatmapProps) {
  // 1. Control "Zoom" by defining the size of each cell in pixels
  const [cellSize, setCellSize] = useState(40);

  const heatmapData = useMemo(() => convertCorrelationToNivoSeries(data), [data]);
  const instrumentCount = heatmapData.length;

  // 2. Calculate dynamic dimensions based on number of instruments and zoom level
  const margin = {top: 80, right: 40, bottom: 60, left: 80};
  const chartWidth = instrumentCount * cellSize + margin.left + margin.right;
  const chartHeight = instrumentCount * cellSize + margin.top + margin.bottom;

  if (instrumentCount === 0) return <div>No data.</div>;

  return (
    <div style={{width: '100%', height: '80vh', display: 'flex', flexDirection: 'column'}}>

      {/* 3. Zoom Controls */}
      <div style={{marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px'}}>
        <label style={{fontSize: '14px', fontWeight: 'bold'}}>Zoom / Cell Size:</label>
        <input
          type="range"
          min="10"
          max="100"
          value={cellSize}
          onChange={(e) => setCellSize(parseInt(e.target.value))}
        />
        <span>{cellSize}px</span>
      </div>

      {/* 4. Scrollable Container */}
      <div style={{
        flex: 1,
        overflow: 'auto', // This allows the chart to expand beyond the viewport
        border: '1px solid #ddd',
        background: '#f9f9f9'
      }}>
        <div style={{width: chartWidth, height: chartHeight}}>
          <HeatMapCanvas
            // Crucial: Use fixed dimensions here
            width={chartWidth}
            height={chartHeight}
            data={heatmapData}
            margin={margin}
            valueFormat=".2f"

            // Performance optimizations for large sets
            forceSquare={true}
            enableLabels={cellSize > 30} // Only show labels if there's room
            animate={instrumentCount < 30}
            inactiveOpacity={1}
            activeOpacity={1}

            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
            }}
            colors={{
              type: 'diverging',
              scheme: 'red_yellow_blue',
              minValue: min,
              maxValue: max,
              divergeAt: 0.5
            }}
            emptyColor="#555555"
            hoverTarget="cell"
            tooltip={({cell}) => (
              <div style={{padding: '8px', background: '#fff', border: '1px solid #ccc'}}>
                <strong>{cell.serieId} × {cell.data.x}</strong>: {cell.data.y?.toFixed(3)}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}