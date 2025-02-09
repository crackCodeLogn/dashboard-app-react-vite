import {useEffect, useState} from "react";
import {fetchGicValuationData} from "../../services/GicDataService.tsx";
import {DataPacket} from "../../assets/proto/generated/DataPacket.ts";
import {Utils} from "../../utils/Utils.tsx";
import Chart1, {ChartOneSeriesProps} from "../chart/echarts/Chart.tsx";
import CustomError from "../error/CustomError.tsx";

export interface GicValuation {
  date: string,
  value: number
}

const PortfolioGicValuationDataComponent = () => {
  const [gicValuationData, setGicValuationData] = useState<GicValuation[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchGicValuationData(undefined, true)
      .then(result => {
        if (!result) {
          throw new Error(`no gic valuation data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);
        const gicValuation: GicValuation[] = [];
        for (const entry of dataPacket.intDoubleMap.entries()) {
          console.log(entry);
          gicValuation.push({date: Utils.getDateInString(entry[0]), value: entry[1]})
        }
        setGicValuationData(gicValuation);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }, []);


  function getChartData(gicValuationData: GicValuation[] | null): ChartOneSeriesProps {
    return {
      title: 'GIC Valuation',
      showLegend: false,
      xData: gicValuationData?.map(v => v.date),
      yData: gicValuationData?.map(v => Utils.yValueFormat(v.value))
    };
  }

  return (
    <>
      {gicValuationData
        ? <Chart1 {...getChartData(gicValuationData)}/>
        : <CustomError errorMsg={!errorMsg ? 'No GIC valuation data fetched' : errorMsg}/>}
    </>
  )

}

export default PortfolioGicValuationDataComponent;