import { Layout,LegacyCard } from "@shopify/polaris";
import React from "react";

export function OrderDetails({ title }) {
  return (
    <div>
      <Layout.Section onethird>
        <LegacyCard title={title} sectioned>
          <p className="text-medium">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio, temporibus.
          </p>
        </LegacyCard>
      </Layout.Section>
    </div>
  );
}


