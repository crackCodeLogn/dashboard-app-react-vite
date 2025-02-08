import GicListings from "../components/gic/GicListings.tsx";
import {fetchGicExpiriesData, fetchGicValuationData} from "../services/GicDataService.tsx";
import {FixedDepositList} from '../assets/proto/generated/FixedDeposit.ts';
import {useEffect, useState} from "react";
import CustomError from "../components/error/CustomError.tsx";
import {DataPacket} from "../assets/proto/generated/DataPacket.ts";
import Chart1, {ChartOneSeriesProps} from "../components/chart/echarts/Chart.tsx";

// todo - split into components

const getDateInString = (date: number): string => {
  const dateStr = date.toString();
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
}

function yValueFormat(value: number): string {
  return value.toFixed(2);
}

export interface GicValuation {
  date: string,
  value: number
}

const Portfolio = () => {
  const [gicExpiryData, setGicExpiryData] = useState<FixedDepositList | null>(null);
  const [gicValuationData, setGicValuationData] = useState<GicValuation[] | null>(null);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchGicExpiriesData(undefined, true)
      .then(result => {
        if (!result) {
          throw new Error(`no gic expiry data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const gicList: FixedDepositList = FixedDepositList.deserializeBinary(binaryData);
        setGicExpiryData(gicList);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });

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
          gicValuation.push({date: getDateInString(entry[0]), value: entry[1]})
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
      yData: gicValuationData?.map(v => yValueFormat(v.value))
    };
  }

  return (
    <div className={'row'}>
      <h1> Portfolio </h1>
      <hr/>
      <div className={'row'}>
        {/*<NetWorth />*/}
        {gicExpiryData ? <GicListings title={'Upcoming GIC expiries'} gicData={gicExpiryData}/> :
          <CustomError errorMsg={'No GIC data fetched'}/>}
        {<Chart1 {...getChartData(gicValuationData)}/>}
      </div>
    </div>
  );
};

export default Portfolio;