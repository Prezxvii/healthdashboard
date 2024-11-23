import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Importing Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary components from Chart.js
import './App.css';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [chartData, setChartData] = useState(null); // State to store chart data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling state

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any previous errors

        // Include the Authorization header
        const response = await axios.get('https://fedskillstest.coalitiontechnologies.workers.dev', {
          headers: {
            'Authorization': 'Basic Y29hbGl0aW9uOnNraWxscy10ZXN0'
          }
        });

        console.log('API Response:', response); // Log the response to inspect the data

        const data = processApiData(response.data); // Process the API data to format it for the chart
        if (!data) {
          throw new Error("No valid data found for Jessica Taylor");
        }
        setChartData(data); // Set the processed data to state
      } catch (error) {
        setError('Error fetching API data'); // Set error message if fetching fails
        console.error('Error fetching API data:', error); // Log the error details for debugging
      } finally {
        setLoading(false); // Set loading to false once data is fetched or error occurs
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>HealthCare Dashboard</h1>
      </header>
      <main>
        {loading && <p>Loading chart data...</p>} {/* Show loading message while data is being fetched */}
        {error && <p>{error}</p>} {/* Display error message if API request fails */}
        {chartData && !loading && !error && (
          <Line data={chartData} options={chartOptions} /> // Render the Line chart once the data is available
        )}
      </main>
    </div>
  );
}

// Function to process API data into Chart.js-compatible format
function processApiData(apiData) {
  // Find the data for Jessica Taylor
  const jessicaData = apiData.find((patient) => patient.name === 'Jessica Taylor');

  // If no data for Jessica Taylor is found, return null
  if (!jessicaData || !jessicaData.diagnosis_history) {
    console.error('No data found for Jessica Taylor');
    return null; // Return null if no data is found for Jessica Taylor
  }

  // Extract the months (for the X-axis), systolic and diastolic blood pressure values (for the Y-axis)
  const labels = jessicaData.diagnosis_history.map((record) => `${record.month} ${record.year}`);
  const systolicValues = jessicaData.diagnosis_history.map((record) => record.blood_pressure.systolic.value);
  const diastolicValues = jessicaData.diagnosis_history.map((record) => record.blood_pressure.diastolic.value);

  return {
    labels, // X-axis labels (months/years)
    datasets: [
      {
        label: 'Systolic Blood Pressure',
        data: systolicValues, // Systolic values for the Y-axis
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'Diastolic Blood Pressure',
        data: diastolicValues, // Diastolic values for the Y-axis
        borderColor: 'rgba(255, 165, 0, 1)',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderWidth: 2,
      },
    ],

  };
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Blood Pressure Over Time',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Date (Month/Year)', // Title for the X-axis
      },
    },
    y: {
      title: {
        display: true,
        text: 'Blood Pressure (mmHg)', // Title for the Y-axis
      },
      beginAtZero: false, // Don't force the Y-axis to start at zero
    },
  },
};

export default App;
