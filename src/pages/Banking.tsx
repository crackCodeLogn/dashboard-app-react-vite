import UpdateBankAccountBalanceComponent from "../components/banking/UpdateBankAccountBalanceComponent.tsx";
import {useEffect} from "react";

const Banking = () => {
  useEffect(() => {
    document.title = 'V2K Banking';
  }, []);

  return (
    <>
      <h1>Banking</h1>
      <hr/>
      <div className={'row'}>
        <UpdateBankAccountBalanceComponent/>
      </div>
    </>
  )
}

export default Banking;