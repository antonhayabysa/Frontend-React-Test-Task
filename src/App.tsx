import React, { useState, useEffect } from "react";
import "./App.css";

type Cell = {
  id: number;
  amount: number;
};

const createMatrix = (m: number, n: number): Cell[][] => {
  let idCounter = 0;
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => ({
      id: idCounter++,
      amount: Math.floor(Math.random() * 900) + 100
    }))
  );
};

const findNearestCells = (matrix: Cell[][], x: number, amount: number) => {
  const flatMatrix = matrix.flat();
  flatMatrix.sort(
    (a, b) => Math.abs(a.amount - amount) - Math.abs(b.amount - amount)
  );
  return new Set(flatMatrix.slice(0, x).map((cell) => cell.id));
};

const App: React.FC = () => {
  const [matrix, setMatrix] = useState<Cell[][]>([]);
  const x = 3;
  const m = 5;
  const n = 5;
  const [highlightedCellIds, setHighlightedCellIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setMatrix(createMatrix(m, n));
  }, [m, n]);

  const handleCellClick = (i: number, j: number) => {
    const newMatrix = [...matrix.map((row) => [...row])];
    newMatrix[i][j].amount += 1;
    setMatrix(newMatrix);
    setHighlightedCellIds(
      findNearestCells(newMatrix, x, newMatrix[i][j].amount)
    );
  };

  const getRowSum = (row: Cell[]) =>
    row.reduce((sum, cell) => sum + cell.amount, 0);
  const getColAvg = (colIndex: number) => {
    const col = matrix.map((row) => row[colIndex]);
    return Math.floor(
      col.reduce((sum, cell) => sum + cell.amount, 0) / col.length
    );
  };

  return (
    <div>
      <table border={1}>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={cell.id}
                  onClick={() => handleCellClick(i, j)}
                  className={
                    highlightedCellIds.has(cell.id) ? "highlighted" : ""
                  }
                >
                  {cell.amount}
                </td>
              ))}
              <td className="sum">{getRowSum(row)}</td>
            </tr>
          ))}
          <tr>
            {Array(n)
              .fill(0)
              .map((_, j) => (
                <td key={j} className="average">
                  {getColAvg(j)}
                </td>
              ))}
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
