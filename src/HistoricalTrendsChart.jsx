import React from 'react';
import { Bar } from 'react-chartjs-2';

const HistoricalTrendsChart = ({ historicalData }) => {
    const data = {
        labels: historicalData.map(d => d.date),
        datasets: [
            {
                label: 'Average Temperature (°C)',
                data: historicalData.map(d => d.avgTemperature),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Max Temperature (°C)',
                data: historicalData.map(d => d.maxTemperature),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Min Temperature (°C)',
                data: historicalData.map(d => d.minTemperature),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    return <Bar data={data} />;
};

export default HistoricalTrendsChart;
