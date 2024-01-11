import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ stocks }) => {
  const data = {
    labels: stocks.map(stock => stock.name),
    datasets: [{
      data: stocks.map(stock => stock.amount),
      backgroundColor: stocks.map(stock => stock.color),
    }]
  };

  return <Pie data={data} />;
};

export default PieChart;
