import GicListings from "../components/gic/GicListings.tsx";
import {fetchGicData} from "../services/GicDataService.tsx";
import {FixedDepositList} from '../assets/proto/generated/FixedDeposit.ts';
import {useEffect, useState} from "react";

const Portfolio = () => {
  const [gicData, setGicData] = useState<FixedDepositList | null>(null);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchGicData(undefined, true)
      .then(result => {
        if (!result) {
          throw new Error(`no gic data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const gicList: FixedDepositList = FixedDepositList.deserializeBinary(binaryData);
        setGicData(gicList);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  return (
    <div className={'row'}>
      <h1> Portfolio </h1>
      <div className={'row'}>
        {/*<NetWorth />*/}
        {gicData ? <GicListings title={'Upcoming GIC expiries'} gicData={gicData}/> : <></>}
      </div>
    </div>
  );
};

export default Portfolio;