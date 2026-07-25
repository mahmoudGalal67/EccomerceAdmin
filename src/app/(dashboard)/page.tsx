
"use client";

import { useState } from "react";


import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import PeriodFilter from "@/components/PeriodFilter";
import RevenueChart from "@/components/RevenueChart";
import TodoList from "@/components/TodoList";
import { useGetPlatformRevenueQuery } from "@/services/AnalyticApi";

const Homepage = () => {

  const [period, setPeriod] =
    useState("30d");

  const { data = [], isLoading } =
    useGetPlatformRevenueQuery(period);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                     <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">

      <PeriodFilter
        value={period}
        onChange={setPeriod}
      />
                       <RevenueChart data={data} />

    </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Transactions" />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg"><TodoList/></div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Popular Products" />
      </div>
    </div>
  );
};

export default Homepage;
