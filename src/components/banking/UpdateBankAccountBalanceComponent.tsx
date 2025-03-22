import "./UpdateBankAccountBalanceComponent.css";
import {useEffect, useState} from "react";
import {BankAccount, BankAccounts} from "../../assets/proto/generated/Bank.ts";
import {
  BankBalanceUpdate,
  getAllBankAccounts,
  getBankAccountBalance,
  updateBankBalanceAmount
} from "../../services/BankingDataService.tsx";
import CustomError from "../error/CustomError.tsx";
import {Utils} from "../../utils/Utils.tsx";

const UpdateBankAccountBalanceComponent = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccounts | null>();
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedBankAccountIndex, setSelectedBankAccountIndex] = useState(-1);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | undefined>();
  const [newAmount, setNewAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('-1.0');

  useEffect(() => {
    getAllBankAccounts()
      .then(result => {
        if (!result) {
          throw new Error(`no bank data found`);
        }
        // proto deser
        const binaryData = new Uint8Array(result);
        const bankAccounts: BankAccounts = BankAccounts.deserializeBinary(binaryData);
        if (bankAccounts.accounts.length === 0) {
          setErrorMsg('empty bank account list. Check server logs.');
          return;
        }
        console.log(`Received ${bankAccounts.accounts.length} CAD accounts in response.`);
        bankAccounts.accounts = [...bankAccounts.accounts].sort((a, b) => a.name.localeCompare(b.name));
        setBankAccounts(bankAccounts);
        setSelectedBankAccountIndex(0);
        const bankAccount = bankAccounts.accounts[0];
        setSelectedBankAccount(bankAccount);
        getAccountBalance(bankAccount);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, [newAmount, selectedBankAccountIndex]);

  const handleAccountSelection = async (e: { target: { value: string; }; }) => {
    const accountIndex = parseInt(e.target.value);
    setSelectedBankAccountIndex(accountIndex);
    if (bankAccounts) {
      const bankAccount = bankAccounts.accounts[accountIndex];
      setSelectedBankAccount(bankAccount);
      await getAccountBalance(bankAccount);
    }
  };

  const getAccountBalance = async (bankAccount: BankAccount) => {
    getBankAccountBalance(bankAccount.externalId)
      .then(result => {
        console.log("Result obtained: " + result);
        // if (!result) throw new Error(`no bank balance found for ${bankAccount.name}`);
        setCurrentAmount(result);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(`error encountered => ${err}`);
      });
  }

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    let amount: number;
    try {
      if (newAmount.length === 0) throw new Error('Empty amount cannot be used');
      amount = parseFloat(newAmount);
    } catch (e) {
      setErrorMsg(e + "");
      console.error(e);
      return;
    }

    if (selectedBankAccount) {
      const bankBalanceUpdate: BankBalanceUpdate = {
        id: selectedBankAccount.externalId,
        amount: amount,
        db: 'crdb'
      };

      console.log(`Will be updating bank account with ext id as: ${bankBalanceUpdate.id} to $${bankBalanceUpdate.amount}`);
      await updateBankBalanceAmount(bankBalanceUpdate, undefined, true)
        .then(() => {
          setSelectedBankAccountIndex(0);
          setSelectedBankAccount(bankAccounts?.accounts[0]);
          setNewAmount('0.0');
          if (bankAccounts?.accounts[0]) getAccountBalance(bankAccounts.accounts[0]);
          else setCurrentAmount('-1.0');
        }).catch(err => {
          console.error(err);
          setErrorMsg(err.toString());
        });
    }
  };

  const getCssClassForAccountBalance = (bankAccount: BankAccount | undefined) => {
    return (!bankAccount || bankAccount?.balance <= 0.0) ? 'current-balance-red' : 'current-balance-green';
  }

  return (
    <div>
      <h3>Update Account Balance</h3>
      {errorMsg && <CustomError errorMsg={errorMsg}/>}
      <div hidden>
        <ul>
          Bank Accounts:
          {bankAccounts && bankAccounts.accounts.map(acc => <li>{acc.name} :: {acc.id} :: {acc.externalId}</li>)}
        </ul>
      </div>
      {bankAccounts &&
          <div className={'row'}>
              <form className={'row-distance-5'} onSubmit={handleSubmit}>
                  <label> Select Bank Account: </label>
                  <select
                      value={selectedBankAccountIndex}
                      onChange={handleAccountSelection}>
                    {bankAccounts.accounts.map((account, index) => (
                      <option key={index} value={index}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  <label>Current Account Balance: </label>
                {/*todo - there seems to be a bug in the coloring, if the account balance is updated to a negative from positive or vice-versa, the color doesn't reflect until refreshed manually*/}
                  <label
                      className={getCssClassForAccountBalance(selectedBankAccount)}>{Utils.formatDollar(parseFloat(currentAmount))}</label>
                  <label>New Account Balance: </label>
                  <input type={"number"}
                         step={"any"}
                         value={newAmount}
                         onChange={(e) => {
                           setNewAmount(e.target.value);
                         }}/>
                  <input type={'submit'}/>
              </form>
          </div>}
    </div>
  )
}

export default UpdateBankAccountBalanceComponent;