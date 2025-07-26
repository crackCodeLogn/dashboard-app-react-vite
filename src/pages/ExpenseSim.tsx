import ExpenseSimulatorComponent from "../components/expense-simulator/ExpenseSimulatorComponent.tsx";


const ExpenseSim = () => {
  return (
    <div className={'row'}>
      <h1> Expense Simulator </h1>
      <div className={'linear'}>
        <ExpenseSimulatorComponent/>
      </div>
    </div>
  );
};

export default ExpenseSim;