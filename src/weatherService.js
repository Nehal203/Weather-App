import db from './db'; // Database connection file
import axios from 'axios'; // For API data fetching

const API_KEY = '72f0b191661b7a4793137a8505155744'; // Apna API key daalna na bhoolen
const API_URL = 'https://api.openweathermap.org/data/2.5/weather'; // Example API URL

export const fetchWeatherDataForCity = async (city) => {
    try {
        const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        return response.data; // Yahan aapko single weather data object milega
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error; // Error ko throw karein taaki calling function handle kar sake
    }
};

// Update aggregateWeatherData to handle single weather data object
const aggregateWeatherData = (weatherData) => {
    const totalTemp = weatherData.main.temp; // Current temperature
    const maxTemp = totalTemp; // Max temperature is same as totalTemp for a single data point
    const minTemp = totalTemp; // Min temperature is same as totalTemp for a single data point
    const condition = weatherData.weather[0].description; // Weather condition
    const city = weatherData.name; // City ka naam lena

    return {
        city, // Add city to the summary
        avgTemperature: totalTemp, // Average is the same as current
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        dominantCondition: condition, // Current condition as dominant condition
        date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };
};

// Daily summary calculation
export const calculateDailySummary = (weatherData) => {
    const dailySummaries = {};
    
    weatherData.forEach(data => {
        const date = new Date(data.date).toLocaleDateString();
        if (!dailySummaries[date]) {
            dailySummaries[date] = {
                totalTemp: 0,
                maxTemp: Number.MIN_VALUE,
                minTemp: Number.MAX_VALUE,
                conditionCounts: {},
                count: 0
            };
        }

        // Update total temperature and count
        dailySummaries[date].totalTemp += data.avgTemperature;
        dailySummaries[date].count += 1;

        // Update max and min temperature
        if (data.maxTemperature > dailySummaries[date].maxTemp) {
            dailySummaries[date].maxTemp = data.maxTemperature;
        }
        if (data.minTemperature < dailySummaries[date].minTemp) {
            dailySummaries[date].minTemp = data.minTemperature;
        }

        // Count weather conditions
        dailySummaries[date].conditionCounts[data.dominantCondition] = 
            (dailySummaries[date].conditionCounts[data.dominantCondition] || 0) + 1;
    });

    // Calculate averages and dominant conditions
    for (const date in dailySummaries) {
        dailySummaries[date].averageTemp = 
            dailySummaries[date].totalTemp / dailySummaries[date].count;

        // Determine dominant condition
        dailySummaries[date].dominantCondition = Object.keys(dailySummaries[date].conditionCounts)
            .reduce((a, b) => dailySummaries[date].conditionCounts[a] > dailySummaries[date].conditionCounts[b] ? a : b);
    }

    return dailySummaries;
};

const saveDailySummary = async (summary) => {
    const query = `INSERT INTO daily_summaries (city, avg_temp, max_temp, min_temp, dominant_condition, date) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [
        summary.city,
        summary.avgTemperature,
        summary.maxTemperature,
        summary.minTemperature,
        summary.dominantCondition,
        summary.date
    ]);
};

export { aggregateWeatherData, saveDailySummary }; // Export for other modules
