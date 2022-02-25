import { useEffect, useState } from "react";
import Filters from "../../components/Filters";
import Header from "../../components/Header";
import ModalStorageTransactions from "../../components/ModalStorageTransactions";
import Resume from "../../components/Resume";
import TransactionsList from "../../components/TransactionsList";
import "./styles.css";

function Main() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    handleLoadTrasactions();
  }, [reload]);

  useEffect(() => {
    if (currentTransaction) {
      setOpen(true);
    }
  }, [currentTransaction]);

  useEffect(() => {
    if (!open) {
      handleLoadTrasactions();
    }

    if (!open && setCurrentTransaction) {
      setCurrentTransaction(false);
    }
  }, [open]);

  function handleOrderTransactions(newTransactions) {
    setTransactions(newTransactions);
  }

  async function handleLoadTrasactions() {
    const response = await fetch("http://localhost:3334/transactions");
    const data = await response.json();

    setTransactions(data);
  }
  return (
    <div className="container-main">
      <Header />
      <main>
        <div>
          <Filters
            transactions={transactions}
            handleOrderTransactions={handleOrderTransactions}
            setReload={setReload}
            reload={reload}
          />
          <TransactionsList
            transactions={transactions}
            setCurrentTransaction={setCurrentTransaction}
            setReload={setReload}
            reload={reload}
            handleOrderTransactions={handleOrderTransactions}
          />
        </div>
        <div>
          <Resume transactions={transactions} />
          <button className="btn-insert-register" onClick={() => setOpen(true)}>
            Adicionar Registro
          </button>
        </div>
      </main>
      <ModalStorageTransactions
        open={open}
        setOpen={setOpen}
        currentTransaction={currentTransaction}
      />
    </div>
  );
}

export default Main;
