import {useState} from "react";
import Table from "react-bootstrap/Table";
import "./ItemPricingComponent.css";
import CustomError from "../error/CustomError.tsx";
import {ItemPricingStats} from "../../assets/proto/generated/ItemPricing.ts";
import {getItemPricingStats} from "../../services/ItemPricingService.tsx";
import {Utils} from "../../utils/Utils.tsx";

function getDefaultStartDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return Number(`${yyyy}${mm}01`);
  // return Number(`20250701`);
}

function getDefaultEndDate() {
  return Number(`20991231`);
}

const ItemPricingComponent = () => {
  const [startDate, setStartDate] = useState<number>(getDefaultStartDate());
  const [endDate, setEndDate] = useState<number>(getDefaultEndDate());
  const [isLoading, setLoading] = useState<boolean>(false);
  const [itemPricingStats, setItemPricingStats] = useState<ItemPricingStats | null>(null);
  const [categoryTotal, setCategoryTotal] = useState(0.0);
  const [categoryExtraTotal, setCategoryExtraTotal] = useState(0.0);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTickerSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMsg('');

    fetchItemPricingData();
  };

  const fetchItemPricingData = () => {
    getItemPricingStats(startDate, endDate)
      .then(result => {
        /*if (!result || !result.data || result.data.length === 0) {
          throw new Error(`no ticker data found for ${tickerSymbol}`);
        }*/
        if (!result) {
          throw new Error(`no data found!`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const stats: ItemPricingStats = ItemPricingStats.deserializeBinary(binaryData);
        console.log(stats);

        let categoryTotal = 0.0;
        for (const val of stats.categoryTotalPriceMap.values()) categoryTotal += val;
        setCategoryTotal(categoryTotal);

        let categoryExtraTotal = 0.0;
        for (const val of stats.categoryExtraAggregateMap.values()) categoryExtraTotal += val;
        setCategoryExtraTotal(categoryExtraTotal);

        setItemPricingStats(stats);
        setLoading(false);
        setError(false);
        setErrorMsg('');
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError(true);
        setErrorMsg(`error encountered => ${err}`);
      });
  };

  /*useEffect(() => {
    if (itemPricingStats) {

    }
  }, [itemPricingStats]);*/

  return (
    <div>
      <div className={'row'}>
        <form className={'row-distance-5'} onSubmit={handleTickerSubmit}>
          <label> Start Date:</label>
          <input type={"text"}
                 value={startDate}
                 onChange={(e) => {
                   setStartDate(Number(e.target.value));
                 }}/>
          <label> End Date:</label>
          <input type={"text"}
                 value={endDate}
                 onChange={(e) => {
                   setEndDate(Number(e.target.value));
                 }}/>
          <input type={'submit'}/>
        </form>
      </div>
      <hr/>

      <div className={'row'}>
        {isLoading ? '*** LOADING ***' : ''}
        {error ? <CustomError errorMsg={errorMsg}/> : ''}
      </div>

      <div className={'row'}>
        {itemPricingStats &&
            <div className={'record-space-around'}>
                <div className={'centralize'}>
                    <div className="item-pricing-container">
                        <div className="item-pricing-big">
                            <h1>Total Spent</h1>
                            <h1>{Utils.formatDollar(itemPricingStats.totalSpent)}</h1>
                        </div>
                        <div className="item-pricing-grid">
                          {[...itemPricingStats.categoryTotalPriceMap.entries()]
                            .sort((a, b) => b[1] - a[1]) // in decreasing order of value
                            .map(([category, value]) => (
                              <div className="item-pricing-item" key={category}>
                                <h2>{category}</h2>
                                <h2 className={'color-default'}>{Utils.formatDollar(value)}</h2>
                                <h3 className={'color-gray'}>{Utils.getPercentage(value, categoryTotal)}</h3>
                              </div>
                            ))}
                        </div>
                      {itemPricingStats.categoryExtraAggregateMap.size > 0 &&
                          <div className={'item-pricing-container'}>
                              <div className={'item-pricing-big'}>
                                  <h3>Breakdown of extra</h3>
                              </div>
                              <div className="item-pricing-grid-3">
                                {[...itemPricingStats.categoryExtraAggregateMap.entries()]
                                  .sort((a, b) => b[1] - a[1]) // in decreasing order of value
                                  .map(([category, value]) => (
                                    <div className="item-pricing-item" key={category}>
                                      <h2>{category}</h2>
                                      <h2 className={'color-default'}>{Utils.formatDollar(value)}</h2>
                                      <h3 className={'color-gray'}>{Utils.getPercentage(value, categoryExtraTotal)}</h3>
                                    </div>
                                  ))}
                              </div>
                          </div>
                      }
                    </div>
                </div>
              {<Table striped bordered hover variant={'light'} className={'table-custom'}>
                <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Price</th>
                  <th>Item | Visit</th>
                  <th>Qty</th>
                  <th>Location</th>
                  <th>Category</th>
                </tr>
                </thead>
                <tbody>
                {
                  itemPricingStats.itemPricingRecords.map((record, recIndex) => (
                    <tr key={recIndex}>
                      <td className={'cell-strong'}>{record.date}</td>
                      <td>{record.source}</td>
                      <td className={'cell-strong'}>{Utils.formatDollar(record.price)}</td>
                      <td>{record.item}</td>
                      <td>{record.quantity}</td>
                      <td>{record.location}</td>
                      <td>{record.category}</td>
                    </tr>
                  ))
                }
                </tbody>
              </Table>}
            </div>}
      </div>
    </div>
  );
}

export default ItemPricingComponent;