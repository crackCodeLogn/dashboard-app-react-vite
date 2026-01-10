import './MarketDataAdhocComponent.css';
import CustomError from "../../../components/error/CustomError.tsx";
import {CorrelationMatrix} from '../../../assets/proto/generated/MarketData.ts';
import {useState} from "react";
import {fetchCorrelationMatrixForSelectedInstruments} from "../../../services/MarketPortfolioService.tsx";
import {DataPacket} from "../../../assets/proto/generated/DataPacket.ts";
import CorrelationHeatmap, {CorrelationEntry} from "../../heatmap/CorrelationHeatmapComponent.tsx";

const CorrelationAdhocComponent = (props: { cellSizePx: number }) => {
  const {cellSizePx} = props;

  const [inputSymbols, setInputSymbols] = useState('');
  const [correlationEntries, setCorrelationEntries] = useState<CorrelationEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const parseInputSymbols = (symbols: string): DataPacket => {
    const data: string[] = symbols.split(",").map(v => v.trim()).filter(v => v.length > 0);
    const dataPacket: DataPacket = new DataPacket();
    if (data) {
      data.map(v => dataPacket.strings.push(v));
    }
    return dataPacket;
  }

  const handleTickerSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setCorrelationEntries([]);
    if (!inputSymbols) {
      setErrorMsg("Invalid input symbols");
      return;
    }
    const symbolsDataPacket: DataPacket = parseInputSymbols(inputSymbols);
    if (!symbolsDataPacket || symbolsDataPacket.strings.length === 0) {
      setErrorMsg("Empty data packet");
      return;
    }
    if (symbolsDataPacket.strings.length === 1) {
      setErrorMsg("Cannot find correlation for just a single imnt");
      return;
    }
    setErrorMsg("");

    fetchCorrelationMatrix(symbolsDataPacket);
  };

  function parseCorrelationEntries(correlationMatrix: CorrelationMatrix): CorrelationEntry[] {
    const correlationEntries: CorrelationEntry[] = [];
    if (correlationMatrix != null) {
      correlationMatrix.entries.map(v => {
        correlationEntries.push({
          instrument1: v.imntRow,
          instrument2: v.imntCol,
          value: v.value
        })
      });
    }
    return correlationEntries;
  }

  const fetchCorrelationMatrix = (dataPacket: DataPacket) => {
    fetchCorrelationMatrixForSelectedInstruments(dataPacket)
      .then(result => {
        if (!result) {
          throw new Error(`no correlation found for ${inputSymbols}`);
        }
        const binaryData = new Uint8Array(result);
        const correlationMatrix: CorrelationMatrix = CorrelationMatrix.deserializeBinary(binaryData);
        setCorrelationEntries(parseCorrelationEntries(correlationMatrix));
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  };

  return (
    <div className={'row'}>
      <div className={'row'}>
        <form className={'row-distance-5'} onSubmit={handleTickerSubmit}>
          <label> Enter tickers for correlation: </label>
          <input type={"text"}
                 value={inputSymbols}
                 onChange={(e) => {
                   let val = e.target.value;
                   if (val) val = e.target.value.toUpperCase();
                   setInputSymbols(val);
                 }}/>
          <input type={'submit'}/>
        </form>
      </div>

      {errorMsg
        ? <CustomError errorMsg={errorMsg}/>
        : <CorrelationHeatmap title={"Correlation Analysis"} data={correlationEntries} cellSizePx={cellSizePx}/>}
    </div>
  )
};

export default CorrelationAdhocComponent;