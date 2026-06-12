/* ============================================
   WEATHER DASHBOARD - JAVASCRIPT
   Async/Await, Fetch API, and DOM Manipulation
   ============================================ */

// ============================================
// 1. CONFIGURATION & CONSTANTS
// ============================================

// API Configuration - Replace YOUR_API_KEY with your actual OpenWeatherMap API key
const API_KEY = 'YOUR API KEY'; // Get free API key from: https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const UNITS = 'metric'; // Use Celsius (metric) or Fahrenheit (imperial)
const STORAGE_KEY = 'lastSearchedCity'; // Key for localStorage

// ============================================
// 2. DOM ELEMENTS
// ============================================

// Input and Button Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Message Elements
const errorMessage = document.getElementById('errorMessage');
const initialMessage = document.getElementById('initialMessage');

// Loading and Weather Display
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherCard = document.getElementById('weatherCard');

// Weather Data Display Elements
const cityName = document.getElementById('cityName');
const weatherDescription = document.getElementById('weatherDescription');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const detailTemp = document.getElementById('detailTemp');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Date/Time Elements
const currentDate = document.getElementById('currentDate');
const currentTime = document.getElementById('currentTime');

// Footer Elements
const lastSearched = document.getElementById('lastSearched');

// ============================================
// 3. EVENT LISTENERS
// ============================================

/**
 * Add event listeners for search functionality
 * - Search button click
 * - Enter key press in input field
 */
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    loadLastSearchedCity();
    // Update time every second
    setInterval(updateDateTime, 1000);
});

// ============================================
// 4. MAIN SEARCH HANDLER
// ============================================

/**
 * Main search handler function
 * Validates input and triggers weather data fetch
 * 
 * Flow:
 * 1. Get and validate input
 * 2. Show loading state
 * 3. Fetch weather data asynchronously
 * 4. Display results or errors
 */
async function handleSearch() {
    const city = searchInput.value.trim();

    // Input validation - Check for empty input
    if (!city) {
        displayError('Please enter a city name');
        return;
    }

    // Clear any previous errors
    clearError();

    // Hide initial message and show loading spinner
    initialMessage.classList.add('hidden');
    weatherCard.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        // Fetch weather data from API
        const weatherData = await fetchWeatherData(city);
        
        // Display the retrieved weather data
        displayWeatherData(weatherData);
        
        // Store the searched city in localStorage
        localStorage.setItem(STORAGE_KEY, city);
        lastSearched.textContent = city;
        
        // Clear input field
        searchInput.value = '';
    } catch (error) {
        // Handle errors (network or API errors)
        displayError(error.message);
        initialMessage.classList.remove('hidden');
    } finally {
        // Hide loading spinner regardless of success or failure
        loadingSpinner.classList.add('hidden');
    }
}

// ============================================
// 5. FETCH WEATHER DATA (ASYNC/AWAIT)
// ============================================

/**
 * Asynchronously fetch weather data from OpenWeatherMap API
 * 
 * @param {string} city - City name to search for
 * @returns {Promise<Object>} Weather data object
 * @throws {Error} For invalid cities or network errors
 * 
 * Example API Response Structure:
 * {
 *   main: { temp, feels_like, humidity, pressure },
 *   weather: [{ description, icon }],
 *   wind: { speed },
 *   visibility,
 *   sys: { sunrise, sunset },
 *   name, cod
 * }
 */
async function fetchWeatherData(city) {
    try {
        // Construct API URL with parameters
        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`;

        // Fetch data from API - using async/await pattern
        const response = await fetch(url);

        // Parse response JSON
        const data = await response.json();

        // Check for API errors (e.g., city not found)
        if (response.status === 404 || data.cod === '404') {
            throw new Error(`❌ City "${city}" not found. Please check the spelling and try again.`);
        }

        if (response.status === 401 || data.cod === '401') {
            throw new Error('❌ Invalid API key. Please add your OpenWeatherMap API key.');
        }

        if (!response.ok) {
            throw new Error(`❌ API Error: ${data.message || 'Unable to fetch weather data'}`);
        }

        // Validate that we have necessary data
        if (!data.main || !data.weather) {
            throw new Error('❌ Incomplete weather data received from API');
        }

        return data;
    } catch (error) {
        // Handle network errors separately
        if (error instanceof TypeError) {
            throw new Error('🌐 Network error: Please check your internet connection and API key.');
        }
        throw error;
    }
}

// ============================================
// 6. DISPLAY WEATHER DATA
// ============================================

/**
 * Parse API response and display weather information on the page
 * Extracts nested JSON data and updates DOM elements
 * 
 * @param {Object} data - Weather data from API
 */
function displayWeatherData(data) {
    try {
        // Extract main weather data
        const temp = Math.round(data.main.temp);
        const feelsLikeTemp = Math.round(data.main.feels_like);
        const humidityPercent = data.main.humidity;
        const windSpeedValue = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
        const pressureValue = data.main.pressure;
        const visibilityKm = (data.visibility / 1000).toFixed(1); // Convert meters to km

        // Extract nested weather description and icon
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Extract time data and convert from Unix timestamp
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);

        // Update UI elements with weather data
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        weatherDescription.textContent = description;
        temperature.textContent = `${temp}°C`;
        weatherIcon.src = weatherIconUrl;
        weatherIcon.alt = description;
        
        // Update detail cards
        detailTemp.textContent = `${temp}°C`;
        feelsLike.textContent = `${feelsLikeTemp}°C`;
        humidity.textContent = `${humidityPercent}%`;
        windSpeed.textContent = `${windSpeedValue} km/h`;
        pressure.textContent = `${pressureValue} hPa`;
        visibility.textContent = `${visibilityKm} km`;

        // Format and display sunrise/sunset times
        sunrise.textContent = formatTime(sunriseTime);
        sunset.textContent = formatTime(sunsetTime);

        // Show weather card and hide initial message
        weatherCard.classList.remove('hidden');
        initialMessage.classList.add('hidden');
    } catch (error) {
        displayError('Error displaying weather data: ' + error.message);
    }
}

// ============================================
// 7. ERROR HANDLING
// ============================================

/**
 * Display error message to user
 * Shows error alert and logs to console for debugging
 * 
 * @param {string} message - Error message to display
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    weatherCard.classList.add('hidden');
    initialMessage.classList.remove('hidden');
    
    // Log error to console for debugging
    console.error('Weather Dashboard Error:', message);
}

/**
 * Clear error message from display
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// ============================================
// 8. UTILITY FUNCTIONS
// ============================================

/**
 * Format Unix timestamp to readable time format
 * 
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time (HH:MM AM/PM)
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Update date and time display in real-time
 * Called every second for dynamic updates
 * Shows full date and time with proper formatting
 */
function updateDateTime() {
    const now = new Date();

    // Format date: "Monday, June 12, 2026"
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);

    // Format time: "14:30:45"
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Update DOM elements
    currentDate.textContent = formattedDate;
    currentTime.textContent = formattedTime;
}

/**
 * Load last searched city from localStorage and display it
 * Called on page load to restore previous user session
 */
function loadLastSearchedCity() {
    const savedCity = localStorage.getItem(STORAGE_KEY);
    
    if (savedCity) {
        lastSearched.textContent = savedCity;
    } else {
        lastSearched.textContent = 'None';
    }
}

// ============================================
// 9. ERROR BOUNDARY
// ============================================

/**
 * Global error handler for any unhandled errors
 * Provides user feedback for unexpected issues
 */
window.addEventListener('error', (event) => {
    console.error('Unexpected error:', event.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================
// 10. INITIALIZATION
// ============================================

/**
 * Log application ready state
 * Useful for debugging and monitoring
 */
console.log('🌤️ Weather Dashboard loaded successfully!');
console.log('📍 Remember to add your OpenWeatherMap API key in the script');
console.log('🔗 Get your free API key at: https://openweathermap.org/api');
