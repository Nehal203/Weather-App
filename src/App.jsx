// App.jsx
import React, { useState } from 'react';
import SearchBox from './SearchBox';
import InfoBox from './InfoBox';
import Button from '@mui/material/Button'; // Button import karna padega

function App() {
    const [city, setCity] = useState('Delhi');
    const [tempUnit, setTempUnit] = useState('Celsius');

    const updateInfo = (cityName) => {
        setCity(cityName);
    };

    const toggleTempUnit = () => {
        setTempUnit((prevUnit) => (prevUnit === 'Celsius' ? 'Fahrenheit' : 'Celsius'));
    };

    return (
        <div>
            <SearchBox updateInfo={updateInfo} />
            <InfoBox tempUnit={tempUnit} city={city} />
            <Button variant="contained" onClick={toggleTempUnit}>
                Switch to {tempUnit === 'Celsius' ? 'Fahrenheit' : 'Celsius'}
            </Button>
        </div>
    );
}

export default App;
