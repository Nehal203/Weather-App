import React from "react";

const TempUnitSelector = ({ setTempUnit, tempUnit }) => {
    const handleChange = (event) => {
        setTempUnit(event.target.value); // Update temperature unit state
    };

    return (
        <div>
            <label htmlFor="tempUnit">Select Temperature Unit: </label>
            <select id="tempUnit" onChange={handleChange} value={tempUnit}>
                <option value="Celsius">Celsius</option>
                <option value="Fahrenheit">Fahrenheit</option>
            </select>
        </div>
    );
};

export default TempUnitSelector;
