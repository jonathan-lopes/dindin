import InputMask from "react-input-mask";

import "./style.css";
import "../../css/spacing.css";
import "../../css/layout.css";
import "../../css/fonts.css";

function Modal({
  hidden,
  editing,
  entryEnable,
  outEnable,
  error,
  form,
  setHidden,
  setEditing,
  setEntryEnable,
  setOutEnable,
  setForm,
  setError,
  handleChange,
  handleRegisterTransaction,
  handleEditingUser,
}) {
  return (
    <div
      className={`backdrop rubik flex-row justify-center align-center ${
        hidden ? "" : "hidden"
      }`}
    >
      <form
        className="modal-container"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex-row justify-between mb-50">
          <h1 className="modal__title">
            {editing ? "Editar Registro" : "Adicionar Registro"}
          </h1>
          <img
            className="close-icon"
            src="./assets/icons-modalClose.svg"
            alt="Fechar"
            onClick={() => {
              setHidden(!hidden);
              setEditing(false);
              setForm({ date: "", description: "", value: "", category: "" });
              setError("");
            }}
          />
        </div>

        <div className="flex-row mb-40">
          <button
            className={`form__btn-option form__btn-entry ${
              entryEnable ? "form__btn-entry--enable" : ""
            }`}
            id="credit-button"
            onClick={() => {
              setEntryEnable(true);
              setOutEnable(false);
            }}
          >
            Entrada
          </button>

          <button
            className={`form__btn-option form__btn-exit ${
              outEnable ? "form__btn-exit--enable" : ""
            }`}
            id="debit-button"
            onClick={() => {
              setOutEnable(true);
              setEntryEnable(false);
            }}
          >
            Saída
          </button>
        </div>

        {error && (
          <div className="error">
            <span>{error}</span>
          </div>
        )}

        <div className="flex-column mb-23">
          <label htmlFor="valor" className="mb-8 form__label">
            Valor
          </label>
          <input
            onChange={handleChange}
            type="text"
            name="value"
            className="form__input"
            id="value"
            value={form.value}
          />
        </div>

        <div className="flex-column mb-23">
          <label htmlFor="categoria" className="mb-8 form__label">
            Categoria
          </label>
          <input
            onChange={handleChange}
            type="text"
            name="category"
            className="form__input"
            id="categoria"
            value={form.category}
          />
        </div>

        <div className="flex-column mb-23">
          <label htmlFor="data" className="mb-8 form__label">
            Data
          </label>

          <InputMask
            mask="99/99/9999"
            onChange={handleChange}
            name="date"
            type="text"
            className="form__input"
            id="data"
            value={form.date}
          />
        </div>

        <div className="flex-column mb-23">
          <label htmlFor="descricao" className="mb-8 form__label">
            Descrição
          </label>
          <input
            onChange={handleChange}
            name="description"
            type="text"
            className="form__input"
            id="descricao"
            value={form.description}
          />
        </div>

        <div className="flex-row justify-center">
          <button
            className="btn-insert"
            onClick={editing ? handleEditingUser : handleRegisterTransaction}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
