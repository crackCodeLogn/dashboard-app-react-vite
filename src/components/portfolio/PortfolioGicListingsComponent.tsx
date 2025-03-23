import {useEffect, useState} from "react";
import {FixedDepositList} from "../../assets/proto/generated/FixedDeposit.ts";
import {fetchGicExpiriesData} from "../../services/GicDataService.tsx";
import GicListingsComponent from "../gic/GicListingsComponent.tsx";
import CustomError from "../error/CustomError.tsx";

const PortfolioGicListingsComponent = () => {
  const [gicExpiryData, setGicExpiryData] = useState<FixedDepositList | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchGicExpiriesData()
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
  }, []);

  return (
    <>
      {gicExpiryData ? <GicListingsComponent title={'Upcoming GIC expiries'} gicData={gicExpiryData}/> :
        <CustomError errorMsg={!errorMsg ? 'No GIC data fetched' : errorMsg}/>}
    </>
  )
}

export default PortfolioGicListingsComponent;