import PortfolioGicListingsComponent from "../components/portfolio/PortfolioGicListingsComponent.tsx";
import PortfolioGicValuationDataComponent from "../components/portfolio/PortfolioGicValuationDataComponent.tsx";


const Portfolio = () => {
  return (
    <div className={'row'}>
      <h1> Portfolio </h1>
      <hr/>
      <div className={'row'}>
        {/*<NetWorth />*/}
        {<PortfolioGicListingsComponent/>}
        {<PortfolioGicValuationDataComponent/>}
      </div>
    </div>
  );
};

export default Portfolio;