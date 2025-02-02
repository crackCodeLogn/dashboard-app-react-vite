import './TutorComponent.css';
import DatePicker from "react-datepicker";
import CustomError from "../error/CustomError.tsx";
import {useEffect, useState} from "react";
import {
  getAllModes,
  getAllSubjects,
  Mode,
  postSessionData,
  SessionData,
  Subject
} from "../../services/TutorDataService.tsx";

const DEFAULT_STUDENT_INPUT: string = 'Enter student here';
const DEFAULT_DATA: string = 'Enter session data here';

const TutorSessionSaveDataComponent = () => {
  const [modes, setModes] = useState<Mode[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[] | null>([]);
  const [student, setStudent] = useState('');
  const [subject, setSubject] = useState<Subject | null | undefined>(null);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [modeMap] = useState(new Map<number, Mode>());
  const [modeSubjectsMap] = useState(new Map<Mode, Subject[]>());
  const [subjectMap] = useState(new Map<number, Subject>());

  useEffect(() => {
    getAllModes()
      .then(result => {
        if (!result) throw new Error(`no modes found`);
        const modeValues: Mode[] = [];
        result.map((val: Mode) => modeValues.push(val as Mode));
        setModes(modeValues);
        setSelectedMode(modeValues[0]);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });

    getAllSubjects()
      .then(result => {
        const subjectValues: Subject[] = [];
        if (!result) throw new Error(`no subjects found`);
        result.map((val: Subject) => subjectValues.push(val as Subject));
        setSubjects(subjectValues);

      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  useEffect(() => {
    if (subjects && modes) {
      modes.map(mode => modeMap.set(mode.id, mode));
      subjects.map(subject => subjectMap.set(subject.id, subject));
      subjects.map(subject => {
        const mode: Mode | undefined = modeMap.get(subject.modeId);
        if (!mode) {
          console.error('No mode defined for ' + subject.modeId);
          return;
        }
        if (!modeSubjectsMap.get(mode)) modeSubjectsMap.set(mode, [subject]);
        else modeSubjectsMap.get(mode)?.push(subject);
      });
      if (selectedMode) {
        const selectedSubjs: Subject[] | undefined = modeSubjectsMap.get(selectedMode);
        if (selectedSubjs) {
          setSelectedSubjects(selectedSubjs);
          setSubject(selectedSubjs[0]);
        }
      }
    }
  }, [modes, subjects]);

  // clear error msg if any of the required component changes
  useEffect(() => {
    if (errorMsg) setErrorMsg('');
  }, [selectedMode, subject, student, date, data]);

  const handleModeChange = (e: { target: { value: string } }) => {
    const modeId: number = parseInt(e.target.value);
    const modeForId: Mode | undefined = modeMap.get(modeId);
    if (modeForId) {
      setSelectedMode(modeForId);
      const subjectsSelected: Subject[] | undefined = modeSubjectsMap.get(modeForId);
      if (subjectsSelected) {
        setSelectedSubjects(subjectsSelected);
        setSubject(subjectsSelected.length > 0 ? subjectsSelected[0] : null);
      }
    }
  }

  const reset = () => {
    setSelectedMode(modes[0]);
    setStudent('');
    const selectedSubjs: Subject[] | undefined = modeSubjectsMap.get(modes[0]);
    if (selectedSubjs) setSubject(selectedSubjs[0]);
    setDate(new Date());
    setData('');
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (selectedMode && subject && student && date && data) {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      const sessionData: SessionData = {
        modeId: selectedMode.id,
        student: student,
        subjectId: subject.id,
        sessionDate: date,
        data: data
      };

      console.log('Initiating session data send')
      postSessionData(sessionData);
      console.log('Sent session data')
      reset();
    } else {
      if (!selectedMode) setErrorMsg("Invalid selected mode");
      else if (!subject) setErrorMsg(`Invalid subject => ${subject}`);
      else if (!student) setErrorMsg("Empty student name");
      else if (!data) setErrorMsg("Empty data");
    }
  };

  return (
    <div>
      <h3>Save session data locally</h3>
      <div className="d-flex justify-content-center">
        <form className={'card-box'} onSubmit={handleSubmit}>
          <div className={'record'}>
            <label>Mode:</label>
            <div className={'record fix-width-200'}>
              {modes.map((mode) => (
                <div key={mode.id} className={'rd-btn-lbl'}>
                  <input
                    id={`mode-${mode.id}`}
                    type={'radio'}
                    name="mode-rg"
                    value={mode.id}
                    checked={selectedMode?.id === mode.id}
                    onChange={handleModeChange}
                  />
                  <label htmlFor={`mode-${mode.id}`} style={{color: mode.color}}>
                    {mode.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={'record'}>
            <label>Student:</label>
            <input
              type={'text'}
              placeholder={DEFAULT_STUDENT_INPUT}
              value={student}
              onChange={e => setStudent(e.target.value)}
            />
          </div>
          <div className={'record'}>
            <label>Subject:</label>
            <select
              className={'select-subjects'}
              value={subject?.id}
              onChange={e => setSubject(subjectMap.get(parseInt(e.target.value)))}
            >
              {selectedSubjects && selectedSubjects.map((subj, index) => (
                <option key={index} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
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
              rows={7}
              placeholder={DEFAULT_DATA}
              className={"leftLine"}
              onChange={(e) => {
                setData(e.target.value);
              }}
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
  );
};

export default TutorSessionSaveDataComponent;