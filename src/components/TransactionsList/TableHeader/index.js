import { useEffect, useState } from "react";
import arrowDown from "../../../assets/arrow-down.svg";
import arrowUp from "../../../assets/arrow-up.svg";
import "./styles.css";
import { orderColumnsAsc, orderColumnsDesc } from "./utils";

function TableHeader({ handleOrderTransactions, transactions }) {
  const [filter, setFilter] = useState("date");
  const [order, setOrder] = useState("asc");

  function handleChangeFilter(type) {
    if (filter === type) {
      setOrder(order === "asc" ? "desc" : "asc");
      return;
    }

    setFilter(type);
  }

  useEffect(() => {
    if (order === "desc") {
      orderAllTransactionsByDesc();
      return;
    }

    orderAllTransactionsByAsc();

    // eslint-disable-next-line
  }, [filter, order]);

  function orderAllTransactionsByAsc() {
    const localTransactions = [...transactions];
    localTransactions.sort((a, b) => orderColumnsAsc(a, b, filter));

    handleOrderTransactions(localTransactions);
  }

  function orderAllTransactionsByDesc() {
    const localTransactions = [...transactions];
    localTransactions.sort((a, b) => orderColumnsDesc(a, b, filter));

    handleOrderTransactions(localTransactions);
  }

  return (
    <div className="table-head">
      <div
        className="column-title cursor-pointer"
        onClick={() => handleChangeFilter("date")}
      >
        <span>Data</span>
        {filter === "date" && (
          <img src={order === "asc" ? arrowUp : arrowDown} alt="Apply filter" />
        )}
      </div>

      <div
        className="column-title cursor-pointer"
        onClick={() => handleChangeFilter("weekDay")}
      >
        <span>Dia da Semana</span>
        {filter === "weekDay" && (
          <img src={order === "asc" ? arrowUp : arrowDown} alt="Apply filter" />
        )}
      </div>

      <div className="column-title">
        <span>Descrição</span>
      </div>

      <div className="column-title">
        <span>Categoria</span>
      </div>

      <div
        className="column-title cursor-pointer"
        onClick={() => handleChangeFilter("value")}
      >
        <span>Valor</span>
        {filter === "value" && (
          <img src={order === "asc" ? arrowUp : arrowDown} alt="Apply filter" />
        )}
      </div>

      <div className="column-title"></div>
    </div>
  );
}

export default TableHeader;
