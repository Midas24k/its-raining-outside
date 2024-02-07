const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const lastSearchedCityElement = document.getElementById("lastSearchedCity");

const API_KEY = "6d2c5466092de2babc8fd56a62672dee";

const createWeatherCard = (cityName, weatherItem, index) => {
    const tempInFahrenheit = ((weatherItem.main.temp - 273.15) * 9/5) + 32;
   
    if (index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${tempInFahrenheit.toFixed(2)}°F</h6>
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
                    <h6>Temp: ${tempInFahrenheit.toFixed(2)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const saveLastSearchedCity = (cityName) => {
    localStorage.setItem("lastSearchedCity", cityName);
}

const getLastSearchedCity = () => {
    return localStorage.getItem("lastSearchedCity") || "";
}

const getWeatherDetails = async (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&=units.imperial&appid=${API_KEY}`;

    try {
        const response = await fetch(WEATHER_API_URL);
        console.log("I work")
        const data = await response.json();

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
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
    if(cityName === "") return;

    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&=limit=1&appid=${API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon , name } = data [0];
        await getWeatherDetails(name, lat, lon);

    } catch (error) {
        alert("An error occurred while fetching the coordinates!");
    }
}

const getGeoCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const{ latitude, longitude } = position.coords;
                const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&=units.imperial&limit=1&appid=${API_KEY}`;
                fetch(API_URL).then(response => response.json()).then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                }).catch(() => {
                    alert("ERROR occured when fetching city name!");
                });

            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Geolocation request denied. Please reset permissions");
                } else {
                    alert("Geolocation request error.");
                }

            });
        
        
}

searchButton.addEventListener("click", getGeoCoordinates);
locationButton.addEventListener("click", getGeoCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());