import LanguageFrComponent from "../components/language/fr/LanguageFrComponent.tsx";

const LanguageFr = () => {
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