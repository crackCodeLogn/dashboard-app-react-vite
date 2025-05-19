import {Link} from "react-router-dom";
import {useState} from "react";
import './NavigationBar.css';

const NavigationBar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  }

  const handleClose = () => {
    setMenuActive(false);
  }

  return (
    <nav className={"navbar"}>
      <div className={`menu-toggle ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
        ☰
      </div>
      <div className={`links ${menuActive ? 'active' : ''}`}>
        <Link to={"/"} onClick={handleClose}>Home</Link>
        <Link to={"/portfolio"} onClick={handleClose}>Portfolio</Link>
        <Link to={"/banking"} onClick={handleClose}>Banking</Link>
        <Link to={"/market/adhoc"} onClick={handleClose}>Market Adhoc</Link>
        <Link to={"/tutor"} onClick={handleClose}>Tutor</Link>
        <Link to={"/library"} onClick={handleClose}>Library</Link>
        <Link to={"/expiry"} onClick={handleClose}>Expiry</Link>
        <Link to={"/language-fr"} onClick={handleClose}>Language: FR</Link>
        <Link to={"/contact"} onClick={handleClose}>Contact</Link>
      </div>
    </nav>
  )
};

export default NavigationBar;