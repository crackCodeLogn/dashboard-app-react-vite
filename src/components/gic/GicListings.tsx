import Table from "react-bootstrap/Table";
import currency from 'currency.js';
import {AccountType, FixedDepositList} from '../../assets/proto/generated/FixedDeposit.ts'

function formatDollar(value: number): string {
  return currency(value).format();
}

const GicListings = (params: { title: string, gicData: FixedDepositList }) => {
  const title: string = params.title;
  const gicData: FixedDepositList = params.gicData;

  return (
    <div>
      <h4>{title}</h4>
      <Table striped bordered hover variant={'light'}>
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
          <tr key={gic.fdNumber}>
            <td>{gic.fdNumber}</td>
            <td>{gic.bankIFSC}</td>
            <td>{gic.startDate}</td>
            <td>{gic.endDate}</td>
            <td>{AccountType[gic.accountType]}</td>
            <td>{formatDollar(gic.depositAmount)}</td>
            <td>{gic.rateOfInterest}</td>
            <td>{formatDollar(gic.expectedInterest)}</td>
            <td>{formatDollar(gic.expectedAmount)}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GicListings;