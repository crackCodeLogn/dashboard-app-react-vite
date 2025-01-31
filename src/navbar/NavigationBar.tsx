import {Link} from "react-router-dom";
import {useState} from "react";
import './NavigationBar.css';

const NavigationBar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  }

  return (
    <nav className={"navbar"}>
      <div className={`menu-toggle ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
        ☰
      </div>
      <div className={`links ${menuActive ? 'active' : ''}`}>
        <Link to={"/"}>Home</Link>
        <Link to={"/portfolio"}>Portfolio</Link>
        <Link to={"/market/adhoc"}>Market Adhoc</Link>
        <Link to={"/tutor"}>Tutor</Link>
        <Link to={"/library"}>Library</Link>
        <Link to={"/expiry"}>Expiry</Link>
        <Link to={"/contact"}>Contact</Link>
      </div>
    </nav>
  )
};

export default NavigationBar;