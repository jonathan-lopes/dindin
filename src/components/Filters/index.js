import { useEffect, useState } from "react";
import filterIcon from "../../assets/filter-icon.svg";
import Chip from "../Chip";
import defaultWeekDays from "./defaultWeekDays";
import "./styles.css";
import { getOnlySelectedCategories, getOnlySelectedWeekDay } from "./utils";

function Filters({ transactions, handleOrderTransactions, setReload, reload }) {
  const [open, setOpen] = useState(false);
  const [weekDays, setWeekDays] = useState(defaultWeekDays);
  const [categories, setCategories] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [transactionsInFilter, setTransactionsInFilter] = useState([]);

  useEffect(() => {
    const allCategories = [];

    for (const transaction of transactionsInFilter) {
      allCategories.push({ name: transaction.category, selected: false });
    }

    const categoriesWithoutDupplicatedItems = [];
    const categIds = [];

    for (const categ of allCategories) {
      if (categIds.indexOf(categ.name) === -1) {
        categIds.push(categ.name);
        categoriesWithoutDupplicatedItems.push(categ);
      }
    }

    setCategories(categoriesWithoutDupplicatedItems);
  }, [transactionsInFilter]);

  useEffect(() => {
    loadTransactionsInFilter();
  }, [transactions]);

  async function loadTransactionsInFilter() {
    const response = await fetch("http://localhost:3334/transactions");
    const data = await response.json();
    setTransactionsInFilter(data);
  }

  function handleSelectedWeekDayFilter(weekDay) {
    const localWeekDay = [...weekDays];

    const day = localWeekDay.find((day) => day.name === weekDay);

    day.selected = !day.selected;
    setWeekDays(localWeekDay);
  }

  function handleSelectedCategFilter(categ) {
    const localCategs = [...categories];

    const category = localCategs.find((category) => category.name === categ);

    category.selected = !category.selected;
    setCategories(localCategs);
  }

  function handleClearFilters() {
    const localWeeksDay = [...weekDays];

    for (const day of localWeeksDay) {
      day.selected = false;
    }

    setWeekDays(defaultWeekDays);
    const localCategs = [...categories];

    for (const categ of localCategs) {
      categ.selected = false;
    }

    setCategories(localCategs);
    setMinValue(0);
    setMaxValue(0);

    setReload(!reload);
  }

  function handleApplyFilters() {
    const selectedDays = getOnlySelectedWeekDay(weekDays);
    const selectedCategs = getOnlySelectedCategories(categories);

    const localTransactions = [...transactionsInFilter];

    if (selectedDays.length === 0 && selectedCategs.length === 0) {
      const transactionsFilteredByValue = [];

      for (const transaction of localTransactions) {
        if (minValue && Number(transaction.value) < minValue) {
          continue;
        }

        if (maxValue && Number(transaction.value) > maxValue) {
          continue;
        }

        if (minValue && minValue <= Number(transaction.value)) {
          transactionsFilteredByValue.push(transaction);
        }

        if (minValue && minValue >= Number(transaction.value)) {
          transactionsFilteredByValue.push(transaction);
        }
      }

      const idTransactions = [];
      const transactionsRemoveDupplicateds = [];

      for (const transaction of transactionsFilteredByValue) {
        if (idTransactions.indexOf(transaction.id) === -1) {
          idTransactions.push(transaction.id);
          transactionsRemoveDupplicateds.push(transaction);
        }
      }

      handleOrderTransactions(transactionsRemoveDupplicateds);
      return;
    }

    const filteredTransactions = [];

    for (const transaction of localTransactions) {
      if (minValue && Number(transaction.value) < minValue) {
        continue;
      }

      if (maxValue && Number(transaction.value) > maxValue) {
        continue;
      }

      if (selectedDays.length > 0 && selectedCategs.length > 0) {
        if (
          selectedDays.includes(transaction.week_day.toLowerCase()) &&
          selectedCategs.includes(transaction.category.toLowerCase())
        ) {
          filteredTransactions.push(transaction);
        }
        continue;
      }

      if (
        selectedDays.length > 0 &&
        selectedDays.includes(transaction.week_day.toLowerCase())
      ) {
        filteredTransactions.push(transaction);
        continue;
      }

      if (
        selectedCategs.length > 0 &&
        selectedCategs.includes(transaction.category.toLowerCase())
      ) {
        filteredTransactions.push(transaction);
        continue;
      }
    }

    const transactionsIdAux = [];
    const transactionsWithoutDuplicateds = [];

    for (const transact of filteredTransactions) {
      if (transactionsIdAux.indexOf(transact.id) === -1) {
        transactionsIdAux.push(transact.id);
        transactionsWithoutDuplicateds.push(transact);
      }
    }

    handleOrderTransactions(transactionsWithoutDuplicateds);
  }

  return (
    <div className="container-filters">
      <button className="btn-filter" onClick={() => setOpen(!open)}>
        <img src={filterIcon} alt="Filters" />
        <strong>Filtrar</strong>
      </button>

      {open && (
        <div className="content-filters">
          <div className="items-filter">
            <strong>Dia da semana</strong>
            <div className="container-chips">
              {weekDays.map((day) => (
                <Chip
                  key={day.name}
                  title={day.name}
                  selected={day.selected}
                  handleSelectChip={handleSelectedWeekDayFilter}
                />
              ))}
            </div>
          </div>

          <div className="separator"></div>

          <div className="items-filter">
            <strong>Categoria</strong>
            <div className="container-chips">
              {categories.map((categ) => (
                <Chip
                  key={categ.name}
                  title={categ.name}
                  selected={categ.selected}
                  handleSelectChip={handleSelectedCategFilter}
                />
              ))}
            </div>
          </div>

          <div className="separator"></div>

          <div className="items-filter">
            <strong>Valor</strong>

            <div className="container-input-filter">
              <label>Min.</label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>

            <div className="container-input-filter">
              <label>Max.</label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>

          <div className="container-action-buttons">
            <button
              className="btn-clear-filters"
              onClick={() => handleClearFilters()}
            >
              Limpar Filtros
            </button>
            <button
              className="btn-apply-filters"
              onClick={() => handleApplyFilters()}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters;
