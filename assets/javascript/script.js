const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const lastSearchedCityElement = document.getElementById("lastSearchedCity");
const API_KEY = "6d2c5466092de2babc8fd56a62672dee";


const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}





const getWeatherDetails = async (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    try {
        const response = await fetch(WEATHER_API_URL);
        const data = await response.json();

        const uniqueForecastDays = [];
        const fiveDaysForcast = data.list.filter(forcast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }  
        });
   
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });

        // Save last searched city to local storage
        saveLastSearchedCity(cityName);
        // Display last searched city in the frontend
        lastSearchedCityElement.textContent = getLastSearchedCity();
    } catch (error) {
        alert("An error occurred while fetching the weather forecast!");
    }

};

const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;

    const API_URL= `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    try {
        const reposnse = await fetch(API_URL);
        const data = await response.json();

        if (!data.length) return alert(`NO coordinates found for ${cityName}`);
        const {lat, lon, name } = data[0];
        await getWeatherDetails(name, lat, lon);
    } catch (error) {
        alert("An error occurred while fetching the coordinates!");

    }
    
}


locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());