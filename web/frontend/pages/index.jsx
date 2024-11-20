import {
  
  Layout,
Page,
  
  LegacyCard,
 
} from "@shopify/polaris";

import { useTranslation, Trans } from "react-i18next";
import { Card, OrderDetails, OrderGraphs } from "../components";
export { Product } from "./Product";
export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <div className="home-section">
        <div className="graphs-section">
          <OrderGraphs/>
     
        </div>
        <div className="cards-section">
        <Layout>
          
            <Card title="Order" />
            <Card title="Order" />
            <Card title="Order" />
            <Card title="Order" />
            <Card title="Order" />
            <Card title="Order" />
          </Layout>
        </div>
        <div className="order-details-section">
          <OrderDetails/>
        </div>
      </div>
    </Page>
  );
}
