import { format } from "date-fns";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import closeicon from "../../assets/close-icon.svg";
import { formatToWeekDay } from "../../utils/formatters";
import "./styles.css";

function ModalStorageTransactions({ open, setOpen, currentTransaction }) {
  const [activeButton, setActiveButton] = useState("debit");
  const [form, setForm] = useState({
    value: 0,
    category: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (open && !currentTransaction) {
      setForm({
        value: 0,
        category: "",
        date: "",
        description: "",
      });

      return;
    }

    if (currentTransaction) {
      setActiveButton(currentTransaction.type);

      setForm({
        date: format(new Date(currentTransaction.date), "dd/MM/yyyy"),
        category: currentTransaction.category,
        value: currentTransaction.value,
        description: currentTransaction.description,
      });
    }
  }, [currentTransaction, open]);

  function handleChange(target) {
    setForm({ ...form, [target.name]: target.value });
  }

  async function registerTransaction(body) {
    return await fetch("http://localhost:3334/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async function updateTransaction(body) {
    return await fetch(
      `http://localhost:3334/transactions/${currentTransaction.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const [day, mouth, year] = form.date.split("/");
    const selectedDate = new Date(`${mouth}/${day}/${year}`);

    const body = {
      date: selectedDate,
      week_day: formatToWeekDay(selectedDate),
      description: form.description,
      value: form.value,
      category: form.category,
      type: activeButton,
    };

    if (currentTransaction) {
      console.log("Entrou");
      await updateTransaction(body);
      setOpen(false);
      return;
    }

    await registerTransaction(body);
    setOpen(false);
  }

  return (
    <div className="backdrop" style={{ display: !open && "none" }}>
      <div>
        <div className="modal-content modal-storage">
          <img
            className="close-icon"
            src={closeicon}
            alt="Close icon"
            onClick={() => setOpen(false)}
          />
          <h2>
            {currentTransaction ? "Editar Registro" : "Adicionar Registro"}
          </h2>

          <div className="container-buttons">
            <button
              className={`btn-empty ${
                activeButton === "credit" && "btn-credit"
              }`}
              onClick={() => setActiveButton("credit")}
            >
              Entrada
            </button>
            <button
              className={`btn-empty ${activeButton === "debit" && "btn-debit"}`}
              onClick={() => setActiveButton("debit")}
            >
              Saída
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Valor</label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={(e) => handleChange(e.target)}
              />
            </div>

            <div>
              <label>Categoria</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={(e) => handleChange(e.target)}
              />
            </div>

            <div>
              <label>Data</label>
              <InputMask
                mask="99/99/9999"
                type="text"
                name="date"
                value={form.date}
                onChange={(e) => handleChange(e.target)}
              />
            </div>

            <div>
              <label>Descrição</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={(e) => handleChange(e.target)}
              />
            </div>

            <div className="container-btn-confirm-insert">
              <button className="btn-confirm-insert">Confirmar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalStorageTransactions;
