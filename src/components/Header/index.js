import "./styles.css";
import logo from "../../assets/logo.svg";

function Header() {
  return (
    <header>
      <img src={logo} alt="Logo" />
    </header>
  );
}

export default Header;
