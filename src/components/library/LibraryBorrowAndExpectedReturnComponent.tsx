import 'react-datepicker/dist/react-datepicker.css';
import {useState} from "react";
import DatePicker from "react-datepicker";
import CustomError from "../error/CustomError.tsx";
import {LibraryData, submitLibraryData} from "../../services/LibraryDataService.tsx";

const DEFAULT_DATA: string = 'Enter book name';

const getDate = (date: Date): Date => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

const LibraryBorrowAndExpectedReturnComponent = () => {
  const [expectedReturnDate, setExpectedReturnDate] = useState(new Date());
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [bookName, setBookName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!bookName) {
      console.error('No book name supplied..');
      setErrorMsg('No book name supplied');
      return;
    }

    const libraryData: LibraryData = {
      borrowDate: getDate(borrowDate),
      returnDate: getDate(expectedReturnDate),
      bookName: bookName
    };
    console.log('posting ' + JSON.stringify(libraryData));
    await submitLibraryData(libraryData);

    setBorrowDate(new Date());
    setExpectedReturnDate(new Date());
    setBookName('');
  };

  return (
    <div className={'row'}>
      <h3>Borrow & Expected Return</h3>
      <div className="d-flex justify-content-center">
        <form className={'card-box'} onSubmit={handleSubmit}>
          <div className={'record'}>
            <label>Book Name:</label>
            <textarea
              value={bookName}
              placeholder={DEFAULT_DATA}
              onChange={e => {
                setBookName(e.target.value);
                setErrorMsg('');
              }}/>
          </div>
          <div className={'record'}>
            <label>Borrow Date: </label>
            <DatePicker
              className={"centerLine"}
              selected={borrowDate}
              onChange={(date) => {
                if (date) setBorrowDate(date)
              }}
              dateFormat={"yyyyMMdd"}
            />
          </div>
          <div className={'record'}>
            <label>Return Date: </label>
            <DatePicker
              className={"centerLine"}
              selected={expectedReturnDate}
              onChange={(date) => {
                if (date) setExpectedReturnDate(date)
              }}
              dateFormat={"yyyyMMdd"}
            />
          </div>
          {errorMsg ? <CustomError errorMsg={errorMsg}/> : ''}
          <input
            className={"btn btn-primary width100"}
            type={"submit"}
            value={'Save'}
          />
        </form>
      </div>
    </div>
  )
};

export default LibraryBorrowAndExpectedReturnComponent;