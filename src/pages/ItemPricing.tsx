import ItemPricingComponent from "../components/item-pricing/ItemPricingComponent.tsx";
import {useEffect} from "react";

const ItemPricing = () => {
  useEffect(() => {
    document.title = 'V2K Item Pricing';
  }, []);

  return (
    <div className={'row'}>
      <h1> Item Pricing </h1>
      <hr/>
      <ItemPricingComponent/>
    </div>
  );
};

export default ItemPricing;