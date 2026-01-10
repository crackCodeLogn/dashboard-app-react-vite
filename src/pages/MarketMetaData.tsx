import MarketMetaDataManager from "../components/market/metadata/MarketMetaDataManager.tsx";
import {useEffect} from "react";

const MarketMetaData = () => {

  useEffect(() => {
    document.title = 'V2K Metadata';
  }, []);

  return (
    <div>
      <MarketMetaDataManager/>
    </div>
  )
}

export default MarketMetaData;