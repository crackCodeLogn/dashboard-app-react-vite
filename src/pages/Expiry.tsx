import ExpiryComponent from "../components/expiry/ExpiryComponent.tsx";


const Expiry = () => {
  return (
    <div className={'row'}>
      <h1> Expiry Dashboard </h1>
      <hr/>
      <h3> Save expiry data for calendar </h3>
      <div className={'linear'}>
        <ExpiryComponent/>
      </div>
    </div>
  );
};

export default Expiry;