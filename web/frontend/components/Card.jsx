import { Layout,LegacyCard } from "@shopify/polaris";
import React from "react";

export function Card({ title }) {
  return (
    <div>
      <Layout.Section onethird>
        <LegacyCard title={title} sectioned>
          <h2>22</h2>
        </LegacyCard>
      </Layout.Section>
    </div>
  );
}
