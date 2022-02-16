import { format, isValid, formatISO } from "date-fns";
import pt_BR from "date-fns/locale/pt-BR";
import { useState, useEffect, useRef } from "react";

import "./style.css";
import "../../css/spacing.css";
import "../../css/layout.css";
import "../../css/fonts.css";

import Modal from "../Modal";
import Resume from "../Resume";
import Filter from "../Filter";

function Tr({
  transaction,
  formatValue,
  setEditing,
  setHidden,
  handleGetUser,
  handleDeleteTransaction,
}) {
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  return (
    <tr className="table-line flex-row justify-between">
      <td className="App__table-td">
        {format(new Date(transaction.date), "dd/MM/yyyy")}
      </td>
      <td className="line-items">{transaction.week_day}</td>
      <td className="line-items flex-wrap line-items__description">
        {transaction.description}
      </td>
      <td className="line-items">{transaction.category}</td>
      <td
        className={`App__table-td ${
          transaction.type === "credit" ? "App__table-td--in" : "out"
        }`}
      >
        {transaction.type === "credit"
          ? formatValue(transaction.value)
          : "- " + formatValue(transaction.value)}
      </td>
      <td>
        <img
          className="delete-icon mr-15"
          src="./assets/icons-edit.svg"
          alt="Editar"
          title="Editar"
          onClick={() => {
            setHidden(true);
            setEditing(true);
            handleGetUser(transaction);
          }}
        />
        <img
          className="edit-icon"
          src="./assets/icons-trash.svg"
          alt="Excluir"
          title="Excluir"
          onClick={() => setModalDeleteVisible(true)}
        />

        <div
          className={`container-confirm-delete rubik flex-column align-center ${
            modalDeleteVisible ? "" : "hidden"
          }`}
        >
          <span className="container-confirm-delete-span mb-4">
            Apagar item?
          </span>

          <div className="flex-row justify-around container-btn">
            <button
              className="btn-actions-confim-delete confim"
              onClick={() => {
                handleDeleteTransaction(transaction.id);
                setModalDeleteVisible(false);
              }}
            >
              Sim
            </button>
            <button
              className="btn-actions-confim-delete delete"
              onClick={() => setModalDeleteVisible(false)}
            >
              Não
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

function Main() {
  const [tableData, setTableData] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [editing, setEditing] = useState(false);
  const [outEnable, setOutEnable] = useState(true);
  const [entryEnable, setEntryEnable] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState({});
  const [form, setForm] = useState({
    date: "",
    description: "",
    value: "",
    category: "",
  });
  const [transactionListing, setTransactionListing] = useState({
    date: true,
    week_day: false,
    value: false,
  });
  const [toggleArrow, setToggleArrow] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  const baseURL = "https://api-finance-dindin.herokuapp.com/transactions";
 
  const operationType = useRef("");

  async function loadTransactions() {
    try {
      const res = await fetch(baseURL);
      const json = await res.json();
      setTableData(json);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (entryEnable) {
      operationType.current = "credit";
    }
    if (outEnable) {
      operationType.current = "debit";
    }
  }, [entryEnable, outEnable]);

  useEffect(() => {
    if (transactionListing.date && toggleArrow) {
      setTableData(
        tableData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return +dateA - +dateB;
        })
      );
    } else if (transactionListing.date && !toggleArrow) {
      setTableData(
        tableData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return +dateB - +dateA;
        })
      );
    }

    if (transactionListing.week_day && toggleArrow) {
      setTableData(
        tableData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return dateA.getDay() - dateB.getDay();
        })
      );
    } else if (transactionListing.week_day && !toggleArrow) {
      setTableData(
        tableData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return dateB.getDay() - dateA.getDay();
        })
      );
    }

    if (transactionListing.value && toggleArrow) {
      setTableData(tableData.sort((a, b) => a.value - b.value));
    } else if (transactionListing.value && !toggleArrow) {
      setTableData(tableData.sort((a, b) => b.value - a.value));
    }
  }, [
    tableData,
    toggleArrow,
    transactionListing.date,
    transactionListing.value,
    transactionListing.week_day,
  ]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validationsForm(fields) {
    const { date, description, value, category } = fields;

    const result = dateISO(date);

    setError("");

    if (!category) {
      setError("O campo categoria é obrigatorio.");
      return 1;
    }

    if (!date) {
      setError("O campo data é obrigatorio.");
      return 1;
    }

    if (isValid(new Date(result)) === false) {
      setError("Data inválida.");
      return 1;
    }

    if (!description) {
      setError("O campo descrição é obrigatorio.");
      return 1;
    }

    if (typeof value === "number") {
      return 0;
    }

    if (value === null) {
      setEditingUser({ ...editingUser, value: form.value });
      return 1;
    }

    if (Number(value) <= 0) {
      setError("Valor precisa ser maior que zero.");
      return 1;
    }

    if (value.substr(3).replace(",", ".")) {
      return 0;
    }

    if (!Number(value.replace(",", "."))) {
      setError("Valor é um campo numérico");
      return 1;
    }

    if (value === undefined || value === "") {
      setError("O campo valor é obrigatorio.");
      return 1;
    }

    return 0;
  }

  function formatValue(amount) {
    const amountFormat = (amount / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return amountFormat;
  }

  function dateISO(date) {
    if (date.includes("T")) {
      return date;
    }

    const [day, month, year] = date.split("/");
    const result = formatISO(new Date(year, month - 1, day));

    return result;
  }

  function formatDayWeek(date) {
    if (typeof date !== "string" || !date) {
      return;
    }

    const [day, month, year] = date.split("/");
    const result = formatISO(new Date(year, month - 1, day));

    const dateTemp = format(new Date(result), "EEE", {
      locale: pt_BR,
    });

    return dateTemp.charAt(0).toUpperCase() + dateTemp.substring(1);
  }

  async function handleRegisterTransaction() {
    if (validationsForm(form) === 1) {
      return;
    }

    const result = dateISO(form.date);

    const data = {
      ...form,
      date: result,
      value: Number(form.value.replace(",", ".")) * 100,
      week_day: formatDayWeek(form.date),
      type: operationType.current,
    };

    try {
      await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await loadTransactions();

      setForm({ date: "", description: "", value: "", category: "" });
      setEntryEnable(false);
      setOutEnable(true);
      setHidden(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleGetUser(userData) {
    setEditingUser(userData);

    setForm({
      date: format(new Date(userData.date), "dd/MM/yyyy"),
      description: userData.description,
      value: formatValue(userData.value),
      category: userData.category,
    });

    if (userData.type === "credit") {
      setEntryEnable(true);
      setOutEnable(false);
    } else {
      setOutEnable(true);
      setEntryEnable(false);
    }
  }

  async function handleEditingUser() {
    if (validationsForm(editingUser) === 1) {
      return;
    }

    let amount = form.value;
    amount = amount.substr(3).replace(",", ".");

    const data = {
      ...form,
      date: dateISO(form.date),
      value: Number(amount) * 100,
      id: editingUser.id,
      type: operationType.current,
      week_day: formatDayWeek(form.date),
    };

    try {
      await fetch(`${baseURL}/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await loadTransactions();
    } catch (error) {
      console.log(error.message);
    }

    setForm({ date: "", description: "", value: "", category: "" });
    setEntryEnable(false);
    setOutEnable(true);
    setHidden(false);
  }

  async function handleDeleteTransaction(userID) {
    try {
      await fetch(`${baseURL}/${userID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await loadTransactions();
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <main className="App__main">
      <button
        className="open-filters-button flex-row align-center mb-30"
        onClick={() => setFilterVisible(!filterVisible)}
      >
        <img className="mr-4" src="./assets/icons-filter.svg" alt="" /> Filtrar
      </button>

      {filterVisible && (
        <Filter
          tableData={tableData}
          filterVisible={filterVisible}
          loadTransactions={loadTransactions}
          setTableData={setTableData}
        />
      )}

      <div className="flex-row justify-around">
        <table className="table">
          <thead className="table-thead">
            <tr className="table-head flex-row justify-between">
              <th
                className="column-title"
                id="date"
                onClick={() => {
                  setTransactionListing({
                    date: true,
                    week_day: false,
                    value: false,
                  });
                  setToggleArrow(!toggleArrow);
                }}
              >
                Data
                <img
                  className={`ml-7 ${transactionListing.date ? "" : "hidden"}`}
                  src={
                    toggleArrow
                      ? "./assets/icons-upArrow.svg"
                      : "./assets/icons-downArrow.svg"
                  }
                  alt=""
                />
              </th>
              <th
                className="column-title"
                id="week-day"
                onClick={() => {
                  setTransactionListing({
                    date: false,
                    week_day: true,
                    value: false,
                  });
                  setToggleArrow(!toggleArrow);
                }}
              >
                Dia da semana
                <img
                  className={`ml-7 ${
                    transactionListing.week_day ? "" : "hidden"
                  }`}
                  src={
                    toggleArrow
                      ? "./assets/icons-upArrow.svg"
                      : "./assets/icons-downArrow.svg"
                  }
                  alt=""
                />
              </th>
              <th className="column-title">Descriçao</th>
              <th className="column-title">Categoria</th>
              <th
                className="column-title"
                id="value-table"
                onClick={() => {
                  setTransactionListing({
                    date: false,
                    week_day: false,
                    value: true,
                  });
                  setToggleArrow(!toggleArrow);
                }}
              >
                Valor
                <img
                  className={`ml-7 ${transactionListing.value ? "" : "hidden"}`}
                  src={
                    toggleArrow
                      ? "./assets/icons-upArrow.svg"
                      : "./assets/icons-downArrow.svg"
                  }
                  alt=""
                />
              </th>
            </tr>
          </thead>

          <tbody className="table-body">
            {tableData.map((transaction) => (
              <Tr
                transaction={transaction}
                key={transaction.id}
                setHidden={setHidden}
                hidden={hidden}
                setEditing={setEditing}
                baseURL={baseURL}
                handleGetUser={handleGetUser}
                formatValue={formatValue}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            ))}
          </tbody>
        </table>

        <Resume
          setHidden={setHidden}
          tableData={tableData}
          formatValue={formatValue}
        />
      </div>

      <Modal
        setTableData={setTableData}
        hidden={hidden}
        setHidden={setHidden}
        baseURL={baseURL}
        loadTransactions={loadTransactions}
        editing={editing}
        setEditing={setEditing}
        entryEnable={entryEnable}
        setEntryEnable={setEntryEnable}
        outEnable={outEnable}
        setOutEnable={setOutEnable}
        error={error}
        setError={setError}
        handleChange={handleChange}
        form={form}
        setForm={setForm}
        handleRegisterTransaction={handleRegisterTransaction}
        handleEditingUser={handleEditingUser}
      />
    </main>
  );
}

export default Main;
