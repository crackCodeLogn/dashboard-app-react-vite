import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from "./navbar/NavigationBar.tsx";
import Home from "./pages/Home.tsx";
import Contact from "./pages/Contact.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import NoPage from "./pages/NoPage.tsx";
import MarketDataAdhoc from "./pages/MarketDataAdhoc.tsx";
import Library from "./pages/Library.tsx";
import Expiry from "./pages/Expiry.tsx";
import Tutor from "./pages/Tutor.tsx";
import Banking from "./pages/Banking.tsx";
import LanguageFr from "./pages/LanguageFr.tsx";


function App() {
  console.log(import.meta.env.VITE_HOST)

  return (
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
        <Route path={"/"} element={<Home/>}/>
        <Route path={"portfolio"} element={<Portfolio/>}/>
        <Route path={"market/adhoc"} element={<MarketDataAdhoc/>}/>
        {/*<Route path={"market/chart2"} element={<TradingViewChart/>}/>*/}
        <Route path={"banking"} element={<Banking/>}/>
        <Route path={"tutor"} element={<Tutor/>}/>
        <Route path={"library"} element={<Library/>}/>
        <Route path={"expiry"} element={<Expiry/>}/>
        <Route path={"language-fr"} element={<LanguageFr/>}/>
        <Route path={"contact"} element={<Contact/>}/>
        <Route path={"*"} element={<NoPage/>}/>
      </Routes>
    </BrowserRouter>
  );

  /*return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )*/
}

export default App
