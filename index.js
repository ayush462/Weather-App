const apiKey = "c16df204597839e0419700ee79348e7f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// DOM elements
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temp');
const cityElement = document.querySelector('.city');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');
const errorElement = document.querySelector('.error');

// Function to update the UI with weather data
function updateWeatherUI(data) {
    tempElement.innerHTML = Math.round(data.main.temp) + "°C";
    cityElement.innerHTML = data.name;
    humidityElement.innerHTML = data.main.humidity + "%";
    windElement.innerHTML = data.wind.speed + " km/h";

    // Update the weather icon based on the weather description
    const weather = data.weather[0].main;
    switch (weather) {
        case "Clouds":
            weatherIcon.src = "images/clouds.png";
            break;
        case "Clear":
            weatherIcon.src = "images/clear.png";
            break;
        case "Drizzle":
            weatherIcon.src = "images/drizzle.png";
            break;
        case "Mist":
            weatherIcon.src = "images/mist.png";
            break;
        case "Snow":
            weatherIcon.src = "images/snow.png";
            break;
        case "Rain":
            weatherIcon.src = "images/rain.png";
            break;
        default:
            weatherIcon.src = "images/default.png";
            break;
    }
}

// Function to fetch weather data based on city name
async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}q=${city}&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            updateWeatherUI(data);
            errorElement.style.display = "none";
        } else {
            errorElement.style.display = "block";
            errorElement.textContent = "seplling check kr ke aa pahale";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorElement.style.display = "block";
        errorElement.textContent = "Failed to retrieve weather data.";
    }
}

// Function to fetch weather data based on user's current location
async function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                if (response.ok) {
                    const data = await response.json();
                    updateWeatherUI(data);
                    errorElement.style.display = "none";
                } else {
                    errorElement.style.display = "block";
                    errorElement.textContent = "Unable to retrieve weather data for your location.";
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
                errorElement.style.display = "block";
                errorElement.textContent = "Failed to retrieve weather data.";
            }
        }, () => {
            errorElement.style.display = "block";
            errorElement.textContent = "Geolocation access denied.";
        });
    } else {
        errorElement.textContent = "Geolocation is not supported by this browser.";
        errorElement.style.display = "block";
    }
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        getCurrentLocationWeather();
    }
});

// Load weather for current location on page load
document.addEventListener('DOMContentLoaded', getCurrentLocationWeather);
