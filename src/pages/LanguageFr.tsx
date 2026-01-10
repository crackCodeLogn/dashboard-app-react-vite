import LanguageFrComponent from "../components/language/fr/LanguageFrComponent.tsx";
import {useEffect} from "react";

const LanguageFr = () => {
  useEffect(() => {
    document.title = 'V2K FR';
  }, []);

  return (
    <div className={'row'}>
      <h1> Language: FRENCH </h1>
      <hr/>
      <h3> Manage French words </h3>
      <div className={'linear'}>
        <LanguageFrComponent/>
      </div>
    </div>
  );
};

export default LanguageFr;