import "./GicListingsComponent.css";
import Table from "react-bootstrap/Table";
import {AccountType, FixedDepositList} from '../../assets/proto/generated/FixedDeposit.ts'
import {Utils} from "../../utils/Utils.tsx";

const GicListingsComponent = (params: { title: string, gicData: FixedDepositList }) => {
  const title: string = params.title;
  const gicData: FixedDepositList = params.gicData;

  const getRowColor = (accountType: number): string => {
    return AccountType[accountType] === "TFSA" ? "highlight" : "";
  }

  return (
    <div>
      <h4>{title}</h4>
      <Table bordered hover variant={'light'}>
        <thead>
        <tr>
          <th>Number</th>
          <th>IFSC</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Type</th>
          <th>Deposit</th>
          <th>ROI</th>
          <th>Interest</th>
          <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        {gicData.FixedDeposit.map((gic) => (
          <tr key={gic.fdNumber} className={getRowColor(gic.accountType)}>
            <td>{gic.fdNumber}</td>
            <td>{gic.bankIFSC}</td>
            <td>{gic.startDate}</td>
            <td>{gic.endDate}</td>
            <td>{AccountType[gic.accountType]}</td>
            <td>{Utils.formatDollar(gic.depositAmount)}</td>
            <td>{gic.rateOfInterest}</td>
            <td>{Utils.formatDollar(gic.expectedInterest)}</td>
            <td>{Utils.formatDollar(gic.expectedAmount)}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GicListingsComponent;