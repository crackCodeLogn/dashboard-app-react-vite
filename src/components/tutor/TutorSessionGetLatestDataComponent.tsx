import './TutorComponent.css';
import CustomError from "../error/CustomError.tsx";
import {useEffect, useState} from "react";
import {getLatestSessionData, GetSessionData} from "../../services/TutorDataService.tsx";

const DEFAULT_STUDENT_INPUT: string = 'Enter student here';
const DEFAULT_DATA: string = 'Latest student session data goes here...';

const TutorSessionGetLatestDataComponent = () => {
  const [student, setStudent] = useState('');
  const [data, setData] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // clear error msg if any of the required component changes
  useEffect(() => {
    if (errorMsg) setErrorMsg('');
  }, [student, data]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (student) {
      console.log('Initiating session data send')
      getLatestSessionData(student)
        .then(result => {
          if (!result) {
            setData('*** no data found ***');
            return;
          }
          const convertedResult: GetSessionData = result as GetSessionData;
          const output: string = `${convertedResult.fileName}\n${convertedResult.fileData}`;
          if (output.trim().length === 0) {
            setData('*** no data found ***');
            return;
          }

          console.log(`Received => ${output} == ${data.toString()}`)
          setData(output);
        })
        .catch(err => {
          console.error(err);
          setErrorMsg(`error encountered => ${err}`);
        });
    } else {
      if (!student) setErrorMsg("Empty student name");
    }
  };

  return (
    <div>
      <h3>Get latest session data</h3>
      <div className="d-flex justify-content-center">
        <form className={'card-box'} onSubmit={handleSubmit}>
          <div className={'record'}>
            <label>Student:</label>
            <input
              type={'text'}
              value={student}
              placeholder={DEFAULT_STUDENT_INPUT}
              onChange={e => setStudent(e.target.value)}
            />
          </div>
          {errorMsg ? <CustomError errorMsg={errorMsg}/> : ''}
          <input
            className={"btn btn-primary width100"}
            type={"submit"}
            value={'Fetch'}
          />
          <div className={'record'}>
            <label>Data:</label>
            <textarea
              value={data}
              readOnly={true}
              rows={10}
              placeholder={DEFAULT_DATA}
              className={"leftLine width250"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorSessionGetLatestDataComponent;