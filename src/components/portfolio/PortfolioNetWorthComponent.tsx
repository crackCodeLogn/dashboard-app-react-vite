import NetWorthComponent from "../net-worth/NetWorthComponent.tsx";
import {useEffect, useState} from "react";

const PortfolioNetWorthComponent = () => {
  const [dataPoints, setDataPoints] = useState(new Map<string, number>());

  useEffect(() => {
    const data: Map<string, number> = new Map<string, number>();

    // replace with call to twm-portfolio-service
    data.set("net-worth", 199999);
    data.set("market", 100000);
    data.set("gic", 49999);
    data.set("bank", 19999);
    data.set("other", 49999);

    setDataPoints(data);
  }, []);

  return (
    <>
      {<NetWorthComponent dataPoints={dataPoints}/>}
    </>
  )
}

export default PortfolioNetWorthComponent;