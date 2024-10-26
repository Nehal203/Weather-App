import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const DailySummaryChart = () => {
    const [summaries, setSummaries] = useState([]);

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/daily_summaries');
                const data = await response.json();
                setSummaries(data);
            } catch (error) {
                console.error('Error fetching daily summaries:', error);
            }
        };

        fetchSummaries();
    }, []);

    const data = {
        labels: summaries.map((s) => new Date(s.created_at).toLocaleDateString()), // Dates as labels
        datasets: [
            {
                label: 'Daily Summaries',
                data: summaries.map((s) => s.summary.length || 0), // Assuming summary length is what you want to show
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>Daily Summary Chart</h2>
            {summaries.length > 0 ? (
                <Bar data={data} />
            ) : (
                <p>No data available for chart.</p>
            )}
        </div>
    );
};

export default DailySummaryChart;
