import { useState, useEffect } from "react";

import "./style.css";
import "../../css/spacing.css";
import "../../css/layout.css";
import "../../css/fonts.css";

function WeekDay({ day, dayClicked, daysSelected }) {
  return (
    <button
      className={`container-chip mb-8 ${
        daysSelected.includes(day) ? "container-chip--active" : ""
      }`}
      onClick={() => dayClicked(day)}
    >
      {day}
      <img
        className="icon-filter"
        src={
          daysSelected.includes(day)
            ? "./assets/icons-filterClose.svg"
            : "./assets/icons-plus.svg"
        }
        alt=""
      />
    </button>
  );
}

function Category({ category, categoryClicked, categoriesSelected }) {
  return (
    <button
      className={`container-chip mb-8 ${
        categoriesSelected.includes(category) ? "container-chip--active" : ""
      }`}
      onClick={() => categoryClicked(category)}
    >
      {category}
      <img
        className="icon-filter"
        src={
          categoriesSelected.includes(category)
            ? "./assets/icons-filterClose.svg"
            : "./assets/icons-plus.svg"
        }
        alt=""
      />
    </button>
  );
}

function Filter({ tableData, loadTransactions, setTableData }) {
  const [filterValue, setFilterValue] = useState({ min: "", max: "" });
  const [categories, setCategories] = useState([]);
  const [daysSelected, setDaySelected] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState([]);

  const weekDays = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  useEffect(() => {
    const filteredCategories = tableData.map((category) => category.category);

    const arr = filteredCategories.filter(
      (category, i) => filteredCategories.indexOf(category) === i
    );

    setCategories(arr);
  }, [tableData]);

  function handleChange(e) {
    setFilterValue({ ...filterValue, [e.target.name]: e.target.value });
  }

  function dayClicked(day) {
    if (daysSelected.includes(day)) {
      const daysFiltered = daysSelected.filter((days) => days !== day);
      setDaySelected(daysFiltered);
      return;
    }

    const days = [...daysSelected];
    days.push(day);
    setDaySelected(days);
  }

  function categoryClicked(category) {
    if (categoriesSelected.includes(category)) {
      const categoryFiltered = categoriesSelected.filter(
        (categories) => categories !== category
      );
      setCategoriesSelected(categoryFiltered);
      return;
    }

    const categories = [...categoriesSelected];
    categories.push(category);
    setCategoriesSelected(categories);
  }

  function clearFilters() {
    setFilterValue({ min: "", max: "" });
    setDaySelected([]);
    setCategoriesSelected([]);
    loadTransactions();
  }

  function applyFilters() {
    const transactions = [...tableData];

    let minValue = Number(filterValue.min) * 100;
    let maxValue = Number(filterValue.max) * 100;

    const filters = transactions.filter((transaction) => {
      if (maxValue === 0) {
        for (let i = 0; i < transactions.length; i++) {
          if (transactions[0].value < transactions[i].value) {
            maxValue = transactions[i].value;
          } else {
            maxValue = transactions[0].value;
          }
        }
      }

      for (let day of daysSelected) {
        if (transaction.week_day === day) {
          return true;
        }
      }

      for (let category of categoriesSelected) {
        if (transaction.category === category) {
          return true;
        }
      }

      return (
        transaction.value >= minValue &&
        transaction.value <= maxValue &&
        transaction.week_day.includes(daysSelected) &&
        transaction.category.includes(categoriesSelected)
      );
    });

    setTableData(filters);
  }

  return (
    <div className="container-filters mb-50 rubik flex-row justify-between">
      <div className="week-day mr-40">
        <h2 className="filter-title mb-20">Dia da semana</h2>

        <div className="flex-row container-filter flex-wrap justify-between">
          {weekDays.map((day) => (
            <WeekDay
              day={day}
              key={day}
              dayClicked={dayClicked}
              daysSelected={daysSelected}
            />
          ))}
        </div>
      </div>

      <hr className="border" />

      <div className="category mr-40">
        <h2 className="filter-title mb-20">Categoria</h2>

        <div className="flex-row container-filter flex-wrap justify-between">
          {categories.map((category) => (
            <Category
              category={category}
              key={category}
              categoryClicked={categoryClicked}
              categoriesSelected={categoriesSelected}
            />
          ))}
        </div>
      </div>

      <hr className="border" />

      <div className="value">
        <h2 className="filter-title mb-20">Valor</h2>

        <div className="flex-column">
          <div className="flex-column mb-16">
            <label className="value-label" htmlFor="min-value">
              Min
            </label>
            <input
              type="number"
              className="value-input"
              id="min-value"
              name="min"
              value={filterValue.min}
              onChange={handleChange}
            />
          </div>

          <div className="flex-column">
            <label className="value-label" htmlFor="max-value">
              Max
            </label>
            <input
              type="number"
              className="value-input"
              id="max-value"
              name="max"
              value={filterValue.max}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="lato self-end">
        <button className="btn-clear-filters btn-filter" onClick={clearFilters}>
          Limpar Filtros
        </button>

        <button className="btn-apply-filters btn-filter" onClick={applyFilters}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default Filter;
