import { useState, useEffect } from "react";
import axios from "axios";
import SearchBox from "./SearchBox"; // SearchBox component for city input
import InfoBox from "./InfoBox"; // InfoBox component for weather details
import TempUnitSelector from "./TempUnitSelector"; // Temperature unit selector component
import "./WeatherApp.css";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const METROS = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

export default function WeatherApp() {
    const [weatherInfo, setWeatherInfo] = useState({
        city: "Wonderland",
        feelslike: 24.84,
        temp: 25.05,
        tempMin: 25.05,
        tempMax: 25.05,
        humidity: 47,
        weather: "haze",
        updateTime: "",
    });

    const [tempUnit, setTempUnit] = useState('Celsius'); // State for temperature unit
    const [error, setError] = useState(null); // Error state

    const API_KEY = import.meta.env.VITE_APP_API_KEY; // Fetch API key from .env
    const interval = import.meta.env.VITE_APP_FETCH_INTERVAL || 300000; // Fetch interval or default to 5 minutes

    // Function to fetch weather info for a specific city
    const fetchWeatherDataForCity = async (city) => {
        console.log(`Fetching weather data for ${city}...`);
        setError(null); // Reset error state

        try {
            const response = await axios.get(`${API_URL}?q=${city},IN&appid=${API_KEY}&units=metric`);
            const data = response.data;

            if (data && data.main) {
                const tempCelsius = data.main.temp;
                const tempFahrenheit = (tempCelsius * 9) / 5 + 32;

                setWeatherInfo({
                    city: data.name,
                    temp: tempUnit === 'Celsius' ? tempCelsius.toFixed(2) : tempFahrenheit.toFixed(2),
                    tempMin: data.main.temp_min,
                    tempMax: data.main.temp_max,
                    humidity: data.main.humidity,
                    feelslike: data.main.feels_like,
                    weather: data.weather[0].description,
                    updateTime: new Date(data.dt * 1000).toLocaleString(),
                });

                console.log(`Updated weather data for ${data.name} at ${new Date().toLocaleTimeString()}`);
            } else {
                // Reset weatherInfo and show error if data is not available
                setWeatherInfo({
                    city: "Unknown",
                    temp: 0,
                    tempMin: 0,
                    tempMax: 0,
                    humidity: 0,
                    feelslike: 0,
                    weather: "N/A",
                    updateTime: "",
                });
                setError("No such place exists!"); // Set error message
                console.error("Weather data is not available.");
            }
        } catch (error) {
            // Reset weatherInfo and show error on request failure
            setWeatherInfo({
                city: "Unknown",
                temp: 0,
                tempMin: 0,
                tempMax: 0,
                humidity: 0,
                feelslike: 0,
                weather: "N/A",
                updateTime: "",
            });
            setError("No such place exists!"); // Set error message
            console.error("Error fetching weather data:", error);
        }
    };

    // Effect for fetching data periodically
    useEffect(() => {
        // Initial fetch for default city
        fetchWeatherDataForCity("Delhi");

        const intervalId = setInterval(() => fetchWeatherDataForCity("Delhi"), interval); // Fetch every `interval` milliseconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [interval]); // Re-run effect if interval changes

    return (
        <div className="weatherAppContainer">
            <h1>Weather App</h1>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            <TempUnitSelector setTempUnit={setTempUnit} tempUnit={tempUnit} /> {/* Pass tempUnit prop */}
            <SearchBox updateInfo={fetchWeatherDataForCity} /> {/* Pass fetchWeatherDataForCity to SearchBox */}
            <InfoBox info={weatherInfo} tempUnit={tempUnit} /> {/* Pass tempUnit to InfoBox */}
            <p>Last updated: {weatherInfo.updateTime}</p> {/* Display last update time */}
        </div>
    );
}
