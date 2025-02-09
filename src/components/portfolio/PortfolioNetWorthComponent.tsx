import NetWorthComponent from "../net-worth/NetWorthComponent.tsx";
import {useEffect, useState} from "react";
import {fetchNetWorthData} from "../../services/NetWorthDataService.tsx";
import {DataPacket} from "../../assets/proto/generated/DataPacket.ts";

const PortfolioNetWorthComponent = () => {
  const [dataPoints, setDataPoints] = useState(new Map<string, number>());
  // const [errorMsg, setErrorMsg] = useState(''); // todo - think later of a viewing case for this?

  useEffect(() => {
    // replace with call to twm-portfolio-service
    /*data.set("net-worth", 199999);
    data.set("market", 100000);
    data.set("gic", 49999);
    data.set("bank", 19999);
    data.set("other", 49999);
    setDataPoints(data);*/

    fetchNetWorthData(undefined, true)
      .then(result => {
        if (!result) {
          throw new Error(`no gic expiry data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const dataPacket: DataPacket = DataPacket.deserializeBinary(binaryData);
        setDataPoints(dataPacket.stringDoubleMap);
      })
      .catch(err => {
        console.error(err);
        // setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  return (
    <>
      {<NetWorthComponent dataPoints={dataPoints}/>}
    </>
  )
}

export default PortfolioNetWorthComponent;