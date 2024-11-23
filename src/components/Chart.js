import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components to use them
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }) => {
  // Chart options for responsiveness, title, and legend
  const options = {
    responsive: true, // Ensures the chart resizes according to the container
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14, // Adjust legend font size for better readability
          },
        },
      },
      title: {
        display: true,
        text: 'Blood Pressure Over Time', // Title of the chart
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          // Customize the tooltip for clearer data display
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} mmHg`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (Months/Years)', // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: 'Blood Pressure (mmHg)', // Y-axis title
        },
        beginAtZero: false, // Avoids resetting the Y-axis to zero if not required
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;

