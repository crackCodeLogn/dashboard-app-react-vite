import 'react-datepicker/dist/react-datepicker.css';
import {useState} from "react";
import {ExpiryData, submitExpiryData} from "../../services/ExpiryDataService.tsx";
import DatePicker from "react-datepicker";
import CustomError from "../error/CustomError.tsx";

const DEFAULT_DATA: string = 'Enter expiry data here';

const getDate = (date: Date): Date => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

const ExpiryComponent = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!data) {
      console.error('No data supplied..');
      setErrorMsg('No data supplied');
      return;
    }

    const expiryData: ExpiryData = {
      date: getDate(date),
      data: data
    };
    console.log('posting ' + JSON.stringify(expiryData));
    await submitExpiryData(expiryData);

    setDate(new Date());
    setData('');
  };

  return (
    <div className="d-flex justify-content-center">
      <form className={'card-box'} onSubmit={handleSubmit}>
        <div className={'record'}>
          <label>Date:</label>
          <DatePicker
            className={"centerLine"}
            selected={date}
            onChange={(date) => {
              if (date) setDate(date)
            }}
            dateFormat={"yyyyMMdd"}
          />
        </div>
        <div className={'record'}>
          <label>Data:</label>
          <textarea
            value={data}
            placeholder={DEFAULT_DATA}
            onChange={e => {
              setData(e.target.value);
              setErrorMsg('');
            }}/>
        </div>
        {errorMsg ? <CustomError errorMsg={errorMsg}/> : ''}
        <input
          className={"btn btn-primary width100"}
          type={"submit"}
          value={'Save'}
        />
      </form>
    </div>
  )
};

export default ExpiryComponent;