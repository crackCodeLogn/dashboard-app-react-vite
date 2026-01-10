import {useEffect} from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Vivek's Dashboard";
  }, []);

  return <h1> Hello </h1>;
}

export default Home;