import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    setLoadingCountries(true);
    fetch('https://crio-location-selector.onrender.com/countries')
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setLoadingCountries(false);
      })
      .catch(() => setLoadingCountries(false));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      setStates([]);
      setSelectedState('');
      setSelectedCity('');
      setCities([]);
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
          setLoadingStates(false);
        })
        .catch(() => setLoadingStates(false));
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoadingCities(true);
      setCities([]);
      setSelectedCity('');
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
          setLoadingCities(false);
        })
        .catch(() => setLoadingCities(false));
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Location Selector</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {/* Country Dropdown */}
          <select
            data-testid="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            disabled={loadingCountries}
          >
            <option value="" key="select-country" disabled>
              {loadingCountries ? 'Loading countries...' : 'Select Country'}
            </option>
            {countries.map((country) => (
              <option key={country} value={country} data-testid={`country-option-${country}`}>{country}</option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            data-testid="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry || loadingStates}
          >
            <option value="" key="select-state" disabled>
              {!selectedCountry ? 'Select State' : loadingStates ? 'Loading states...' : 'Select State'}
            </option>
            {states.map((state) => (
              <option key={state} value={state} data-testid={`state-option-${state}`}>{state}</option>
            ))}
          </select>

          {/* City Dropdown */}
          <select
            data-testid="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState || loadingCities}
          >
            <option value="" key="select-city" disabled>
              {!selectedState ? 'Select City' : loadingCities ? 'Loading cities...' : 'Select City'}
            </option>
            {cities.map((city) => (
              <option key={city} value={city} data-testid={`city-option-${city}`}>{city}</option>
            ))}
          </select>
        </div>
        {selectedCountry && selectedState && selectedCity && (
          <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            You selected {selectedCity}, {selectedState}, {selectedCountry}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
