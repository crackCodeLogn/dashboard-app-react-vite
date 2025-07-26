import {readAllLines} from "../../services/ExpenseSimulatorCsvReaderService.tsx"
import {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import "./ExpenseSimulatorComponent.css";


function getKey(row: string[], map: Map<string, number>, key: string) {
  let retVal = -1;
  if (map.has(key)) {
    const value = map.get(key);
    if (value !== undefined) {
      retVal = value;
    }
  }
  return `row-${row[retVal]}`;
}

function getClassName(row: string[], map: Map<string, number>, cellIndex: number) {
  function getOrDefault(key: string, def = 0) {
    const answer = map.get(key);
    return answer === undefined ? def : answer;
  }

  switch (cellIndex) {
    case getOrDefault("Date"):
    case getOrDefault("From"):
    case getOrDefault("To"):
      return "cell-strong";
  }

  if (getOrDefault("Amount") === cellIndex) {
    const styles = [];
    switch (row[getOrDefault("Mode")]) {
      case 'I':
        styles.push("color-investment");
        break;
      case 'SAL':
      case 'INC':
      case 'EXP':
        styles.push("color-income");
        break;
      case 'U':
        styles.push("color-update-expense");
        break;
      case 'RB':
        styles.push("color-rebal");
        break;
      default:
        styles.push("color-default");
    }
    styles.push("cell-strong");
    return styles.join(" ");
  }
  return "";
}

const ExpenseSimulatorComponent = () => {
  const [colHeader, setColHeader] = useState<string[]>([]);
  const [colNameIndexMap, setColNameIndexMap] = useState(new Map<string, number>());
  const [rows, setRows] = useState<string[][]>([[]]);

  useEffect(() => {
    readAllLines()
      .then(data => {
        data = data.trim();
        if (data.length > 0) {
          const recs = data.split("\n");
          const headerRow = recs[0].split(",");
          headerRow.push("Seq");

          const nameIndexMap = new Map<string, number>();
          headerRow.map((cell, index) => {
            nameIndexMap.set(cell, index);
          });
          setColHeader(headerRow);
          setColNameIndexMap(nameIndexMap);
          // console.log(nameIndexMap);

          const dataRows: string[][] = [];
          let rowCount = 1;
          for (const rec of recs.slice(1)) {
            const cells = rec.split(",");
            cells.push(`${rowCount}`);
            rowCount++;
            dataRows.push(cells);
          }
          setRows(dataRows);
        }
      });
  }, []);

  return (
    <div>
      <Table bordered hover variant={'light'}>
        <thead>
        <tr>
          {colHeader.map((col, colIndex) => (
            <th key={`col-${colIndex}`}>{col}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {rows.map((row) => (
          <tr key={getKey(row, colNameIndexMap, "Seq")}>
            {row.map((cell, cellIndex) => (
              <td key={`col-${cellIndex}`} className={getClassName(row, colNameIndexMap, cellIndex)}>{cell}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ExpenseSimulatorComponent;