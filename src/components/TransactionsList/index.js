import { useState } from "react";
import deleteIcon from "../../assets/delete-icon.svg";
import editIcon from "../../assets/edit-icon.svg";
import {
  capitalizeWord,
  formatToDate,
  formatToMoney
} from "../../utils/formatters";
import ConfirmChoose from "../ConfirmChoose";
import "./styles.css";
import TableHeader from "./TableHeader";

function TransactionsList({
  transactions,
  setCurrentTransaction,
  setReload,
  reload,
  handleOrderTransactions,
}) {
  const [idItemDelete, setIdItemDelete] = useState(null);

  async function handleDeleteItem() {
    await fetch(`http://localhost:3334/transactions/${idItemDelete}`, {
      method: "DELETE",
    });

    setIdItemDelete(null);
    setReload(!reload);
  }

  return (
    <div className="table">
      <TableHeader
        handleOrderTransactions={handleOrderTransactions}
        transactions={transactions}
      />

      <div className="table-body">
        {transactions.map((transaction) => (
          <div className="table-line" key={transaction.id}>
            <div className="line-items">{formatToDate(transaction.date)}</div>
            <div className="line-items">
              {capitalizeWord(transaction.week_day)}
            </div>
            <div className="line-items">{transaction.description}</div>
            <div className="line-items">{transaction.category}</div>
            <div
              className="line-items values-item"
              style={{
                color: transaction.type === "credit" ? "#7b61ff" : "#Fa8c10",
              }}
            >
              {formatToMoney(transaction.value)}
            </div>
            <div className="line-items">
              <img
                src={editIcon}
                alt="Edit icon"
                className="action-button"
                onClick={() => setCurrentTransaction(transaction)}
              />
              <img
                src={deleteIcon}
                alt="Delete icon"
                className="action-button"
                onClick={() => setIdItemDelete(transaction.id)}
              />

              <ConfirmChoose
                show={transaction.id === idItemDelete}
                setClose={() => setIdItemDelete(null)}
                message="Apagar item?"
                handleConfirm={() => handleDeleteItem()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsList;
