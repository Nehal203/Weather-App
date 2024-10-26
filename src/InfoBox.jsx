import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import "./InfoBox.css";

export default function InfoBox({ tempUnit, city }) {
    const [weatherInfo, setWeatherInfo] = useState({
        city: 'Delhi',
        temp: 0,
        humidity: 0,
        tempMin: 0,
        tempMax: 0,
        feelslike: 0,
        weather: ''
    });

    const HOT_URL = "https://images.unsplash.com/photo-1722858344552-7acf888a7046?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGR1c3R5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
    const COLD_URL = "https://images.unsplash.com/photo-1578403881549-b80b37102b94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fGR1c3R5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
    const RAIN_URL = "https://images.unsplash.com/photo-1533722616720-dbe64a9cda4c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGR1c3R5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
    const DEFAULT_URL = "https://images.unsplash.com/photo-1532598401890-e5014a0c9053?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGR1c3R5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D"; // Default image for invalid city

    const fetchWeatherData = async (city) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_API_KEY}&units=${tempUnit === 'Celsius' ? 'metric' : 'imperial'}`);
            const data = await response.json();
            console.log(data); // API response log karein

            if (response.ok) {
                setWeatherInfo({
                    city: data.name,
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    tempMin: data.main.temp_min,
                    tempMax: data.main.temp_max,
                    feelslike: data.main.feels_like,
                    weather: data.weather[0].description
                });
            } else {
                console.error('Error fetching weather data:', data.message);
                setWeatherInfo({
                    city: city,
                    temp: 0,
                    humidity: 0,
                    tempMin: 0,
                    tempMax: 0,
                    feelslike: 0,
                    weather: 'Not available'
                });
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        if (city) {
            fetchWeatherData(city); // Selected city ke liye weather data fetch karein
        }
    }, [city, tempUnit]); // City ya tempUnit change hone par re-run karein

    const backgroundImage = weatherInfo.temp < 0 ? COLD_URL : (weatherInfo.humidity > 80 ? RAIN_URL : (weatherInfo.temp > 15 ? HOT_URL : COLD_URL));
    const isCityValid = weatherInfo.weather !== 'Not available'; // City valid hone ki condition

    return (
        <div className="InfoBox" style={{
            backgroundImage: `url(${isCityValid ? backgroundImage : DEFAULT_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            width: '100%',
            position: 'relative',
            borderRadius: '8px'
        }}>
            <div className='cardContainer'>
                <Card sx={{
                    maxWidth: 345,
                    backgroundColor: 'rgb(191, 223, 231)', // Card ka background color
                    zIndex: 2 // Card ko background se upar rakhne ke liye
                }} className="card">
                    <CardContent className="cardContent">
                        {!isCityValid ? ( // Agar city invalid hai toh message dikhai de
                            <Typography variant="h6" color='error'>
                                No such place found
                            </Typography>
                        ) : (
                            <Typography gutterBottom variant="h5" component="div">
                                {weatherInfo.city}{" "}
                                {weatherInfo.humidity > 80 ? (<ThunderstormIcon className="icon" />) : weatherInfo.temp > 15 ? (<WbSunnyIcon className="icon" />) : (<AcUnitIcon className="icon" />)}
                            </Typography>
                        )}
                        {isCityValid && (
                            <Typography variant="body2" color='text.secondary'>
                                <b>Temperature: {weatherInfo.temp.toFixed(2)}°{tempUnit === 'Celsius' ? 'C' : 'F'}</b><br />
                                <b>Humidity: {weatherInfo.humidity}%</b><br />
                                <b>Min Temp: {weatherInfo.tempMin.toFixed(2)}°{tempUnit === 'Celsius' ? 'C' : 'F'}</b><br />
                                <b>Max Temp: {weatherInfo.tempMax.toFixed(2)}°{tempUnit === 'Celsius' ? 'C' : 'F'}</b><br />
                                <b>The weather can be described as <i>{weatherInfo.weather}</i> and feels like <i>{weatherInfo.feelslike.toFixed(2)}°{tempUnit === 'Celsius' ? 'C' : 'F'}</i></b>
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
