import { useState, useEffect } from "react";

import "./style.css";
import "../../css/spacing.css";
import "../../css/layout.css";
import "../../css/fonts.css";

function Resume({ setHidden, tableData, formatValue }) {
  const [resume, setResume] = useState({
    entry: 0,
    out: 0,
    balance: 0,
  });

  let sumEntry = 0;
  let sumOut = 0;

  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i].type === "credit") {
      sumEntry += Number(tableData[i].value);
    } else {
      sumOut += Number(tableData[i].value);
    }
  }

  useEffect(() => {
    setResume({
      entry: sumEntry,
      out: sumOut,
      balance: sumEntry - sumOut,
    });
  }, [sumEntry, sumOut, tableData]);

  return (
    <div className="flex-column">
      <div className="container-resume flex-column rubik mb-20">
        <h1 className="resume-title mb-23">Resumo</h1>

        <div className="flex-row justify-between mb-10">
          <span className="resume__span">Entradas</span>
          <span className="resume__values in">
            {formatValue(resume.entry)}
          </span>
        </div>

        <div className="flex-row justify-between mb-20">
          <span className="resume__span">Saídas</span>
          <span className="resume__values out">
            {formatValue(resume.out)}
          </span>
        </div>

        <hr className="hr mb-16" />

        <div className="flex-row justify-between">
          <span className="resume__span--balance">Saldo</span>
          <span className="balance">
            {formatValue(resume.balance)}
          </span>
        </div>
      </div>
      <button className="btn-add" onClick={() => setHidden(true)}>
        Adicionar Registro
      </button>
    </div>
  );
}

export default Resume;
