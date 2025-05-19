import React, {useState} from 'react';
import "./LanguageFrComponent.css";
import apiService from "../../../services/LibraryFrDataService.tsx";
import CustomError from "../../error/CustomError.tsx";

interface FrenchWordInputForm {
  frenchWord: string;
  englishMeaning: string;
  gender: 'le' | 'la' | 'les' | "l'" | 'uni' | '-'; // uni indicates the word form remains same for m/f
  posTags: ('preposition' | 'adverb' | 'noun' | 'verb' | 'adj')[];
  gender2: 'm' | 'f' | '-';
  pronunciation: string;
  source: string;
}

const posTagOptions = [
  {value: 'adverb', label: 'Adverb'},
  {value: 'adj', label: 'Adjective'},
  {value: 'noun', label: 'Noun'},
  {value: 'preposition', label: 'Preposition'},
  {value: 'verb', label: 'Verb'},
];

const genderOptions = [
  {value: 'le', label: 'le'},
  {value: 'la', label: 'la'},
  {value: 'les', label: 'les'},
  {value: "l'", label: "l'"},
  {value: "uni", label: "uni"},
  {value: "-", label: "-"},
];

const gender2Options = [
  {value: 'm', label: 'm (masculine)'},
  {value: 'f', label: 'f (feminine)'},
  {value: '-', label: '-'},
];

const LanguageFrComponent: React.FC = () => {
  const [formData, setFormData] = useState<FrenchWordInputForm>({
    frenchWord: '',
    englishMeaning: '',
    gender: 'le',
    posTags: [],
    gender2: '-',
    pronunciation: '',
    source: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, options} = e.target;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({...formData, [name]: selectedValues as ('preposition' | 'adverb' | 'noun' | 'verb' | 'adj')[]});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData); // todo - remove post dev

    try {
      await apiService.doesFrenchWordExist(formData.frenchWord)
        .then(response => {
          if (response) {
            console.log(`Not a new word: ${formData.frenchWord}`);
            setErrorMsg(`Not a new word`);
          } else {
            apiService.postFrenchWord(formData)
              .then(response => {
                if (response.ok) {
                  console.log('French word data submitted successfully!');
                  setFormData({
                    frenchWord: '',
                    englishMeaning: '',
                    gender: 'le',
                    posTags: [],
                    gender2: '-',
                    pronunciation: '',
                    source: '',
                  });
                  setErrorMsg('');
                } else {
                  console.error('Failed to submit French word data.');
                  setErrorMsg('Failed to submit French word data.');
                }
              })
              .catch(err => {
                console.error(err);
                setErrorMsg(err);
              });
          }
        })
    } catch (error) {
      console.error(error);
      setErrorMsg(`error: ${error}`);
    }
  };

  return (
    <div className={'container'}>
      <h2 className={'heading'}>Add New French Word</h2>
      <form onSubmit={handleSubmit} className={'form'}>
        <div className={'formGroup'}>
          <label htmlFor="frenchWord" className={'label'}>French Word:</label>
          <input
            type="text"
            id="frenchWord"
            name="frenchWord"
            value={formData.frenchWord}
            onChange={handleChange}
            className={'input'}
            required
          />
        </div>
        <div className={'formGroup'}>
          {errorMsg ? <CustomError errorMsg={errorMsg}/> : ''}
        </div>

        <div className={'formGroup'}>
          <label htmlFor="englishMeaning" className={'label'}>English Meaning:</label>
          <input
            type="text"
            id="englishMeaning"
            name="englishMeaning"
            value={formData.englishMeaning}
            onChange={handleChange}
            className={'input'}
            required
          />
        </div>

        <div className={'formGroup'}>
          <label htmlFor="gender" className={'label'}>Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={'select'}
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={'formGroup'}>
          <label htmlFor="posTags" className={'label'}>Part of Speech (POS):</label>
          <select
            id="posTags"
            name="posTags"
            multiple
            value={formData.posTags}
            onChange={handleMultiSelectChange}
            className={'multiSelect'}
          >
            {posTagOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={'formGroup'}>
          <label htmlFor="gender2" className={'label'}>Gender (Optional):</label>
          <select
            id="gender2"
            name="gender2"
            value={formData.gender2}
            onChange={handleChange}
            className={'select'}
          >
            {gender2Options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={'formGroup'}>
          <label htmlFor="pronunciation" className={'label'}>Pronunciation:</label>
          <input
            type="text"
            id="pronunciation"
            name="pronunciation"
            value={formData.pronunciation}
            onChange={handleChange}
            className={'input'}
          />
        </div>

        <div className={'formGroup'}>
          <label htmlFor="source" className={'label'}>Source:</label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={'input'}
          />
        </div>

        <button type="submit" className={'button'}>Add Word</button>
      </form>
    </div>
  );
};

export default LanguageFrComponent;