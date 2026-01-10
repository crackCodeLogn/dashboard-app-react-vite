import ExpenseSimulatorComponent from "../components/expense-simulator/ExpenseSimulatorComponent.tsx";
import {useEffect} from "react";


const ExpenseSim = () => {
  useEffect(() => {
    document.title = 'V2K Expense-Sim';
  }, []);

  return (
    <div className={'row'}>
      <h1> Expense Simulator </h1>
      <hr/>
      <div className={'linear'}>
        <ExpenseSimulatorComponent/>
      </div>
    </div>
  );
};

export default ExpenseSim;