import PortfolioGicListingsComponent from "../components/portfolio/PortfolioGicListingsComponent.tsx";
import PortfolioGicValuationDataComponent from "../components/portfolio/PortfolioGicValuationDataComponent.tsx";
import PortfolioNetWorthComponent from "../components/portfolio/PortfolioNetWorthComponent.tsx";


const Portfolio = () => {
  return (
    <div className={'row'}>
      <h1> Portfolio </h1>
      <hr/>
      <div className={'row'}>
        <div className={'record-space-around'}>
          {<PortfolioNetWorthComponent/>}
          {<PortfolioGicListingsComponent/>}
        </div>
        {<PortfolioGicValuationDataComponent/>}
      </div>
    </div>
  );
};

export default Portfolio;