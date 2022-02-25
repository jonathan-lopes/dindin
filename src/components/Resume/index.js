import { useEffect, useState } from "react";
import "./styles.css";
import { formatToMoney } from "../../utils/formatters";

function Resume({ transactions }) {
  const [resume, setResume] = useState({ credit: 0, debit: 0, balance: 0 });

  useEffect(() => {
    const sumCredit = transactions.reduce((acc, item) => {
      return item.type === "credit" ? acc + Number(item.value) : acc + 0;
    }, 0);

    const sumDebit = transactions.reduce((acc, item) => {
      return item.type === "debit" ? acc + Number(item.value) : acc + 0;
    }, 0);

    setResume({
      credit: sumCredit,
      debit: sumDebit,
      balance: sumCredit - sumDebit,
    });
  }, [transactions]);

  return (
    <div className="container-resume">
      <h3>Resumo</h3>
      <div>
        <span>Entradas</span>
        <strong className="in">{formatToMoney(resume.credit)}</strong>
      </div>
      <div>
        <span>Saídas</span>
        <strong className="out">{formatToMoney(resume.debit)}</strong>
      </div>
      <div className="horizontal-line"></div>
      <div>
        <span>Saldo</span>
        <strong className="balance">{formatToMoney(resume.balance)}</strong>
      </div>
    </div>
  );
}

export default Resume;
