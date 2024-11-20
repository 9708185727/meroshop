import React, { useState } from "react";
import { storeData } from "../data";
import { Layout, LegacyCard } from "@shopify/polaris";
import {Chart as ChartJS} from 'chart.js/auto'
import {Line,Bar,Doughnut} from 'react-chartjs-2'
export function OrderGraphs() {
  console.log(storeData);
  let [data,setData]=useState({
    labels:storeData.map((d)=>d.year),
    datasets:[
        {
            label:"Order Details",
            data:storeData.map((d)=>d.order),
            // data:storeData.map((d)=>d.completed),
            backgroundColor: ['#008170', '#000000', '#8e8e8e', '#81BF37']

        }
    ]
  })
  
  return (
    <div>
      <Layout>
        <Layout.Section oneHalf>
          <LegacyCard title="Total Orders" sectioned>
            <Line data={data} options={{responsive:'true',maintainAspectRatio:"false"}}/>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneThird>
          <LegacyCard title="Completed Orders" sectioned>
          <Doughnut data={data} options={{responsive:'true',maintainAspectRatio:"false"}}/>
          </LegacyCard>

        </Layout.Section>
        <Layout.Section oneThird>
          <LegacyCard title="Remaining Orders" sectioned>
            <Bar data={data} options={{responsive:'true',maintainAspectRatio:"false"}}></Bar>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </div>
  );
}
