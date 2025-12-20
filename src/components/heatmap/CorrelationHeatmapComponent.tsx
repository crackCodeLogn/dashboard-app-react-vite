import {ResponsiveHeatMap} from '@nivo/heatmap'

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

export function convertCorrelationToNivoSeries(
  data: CorrelationEntry[]
): NivoHeatmapSeries[] {
  // Collect unique instruments
  const instruments = Array.from(
    new Set(data.flatMap(d => [d.instrument1, d.instrument2]))
  )

  // Build a lookup for fast access
  const valueMap = new Map<string, number>()
  data.forEach(({instrument1, instrument2, value}) => {
    valueMap.set(`${instrument1}::${instrument2}`, value)
  })

  // Build Nivo series format
  return instruments.map(rowInstrument => ({
    id: rowInstrument,
    data: instruments.map(colInstrument => ({
      x: colInstrument,
      y: valueMap.get(`${rowInstrument}::${colInstrument}`) ?? null,
    })),
  }))
}

// ---- Component ----
export default function CorrelationHeatmap({
                                             data,
                                             min = -1,
                                             max = 1,
                                           }: CorrelationHeatmapProps) {
  const heatmapData = convertCorrelationToNivoSeries(data);

  return (
    <div style={{height: 1000, width: 1000}}>
      <ResponsiveHeatMap
        data={heatmapData}
        margin={{top: 60, right: 90, bottom: 60, left: 90}}
        valueFormat=".2f"
        axisTop={{tickRotation: -60}}
        colors={{
          type: 'diverging',
          scheme: 'red_yellow_green',
          // divergeAt: 0.5,
          minValue: min,
          maxValue: max
        }}
        emptyColor="#555555"
        legends={[
          {
            anchor: 'bottom',
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: '.2f',
            title: 'Correlation →',
            titleAlign: 'start',
            titleOffset: 4
          }
        ]}
      />
    </div>
  )
}
