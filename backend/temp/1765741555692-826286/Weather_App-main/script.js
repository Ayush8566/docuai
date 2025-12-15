const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather-body');


async function checkWeather(city){
    if (!city.trim()) {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        return;
    }

    const api_key = "10f4146252d2e32d418d26be3a7b1ece";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const weather_data = await response.json();

        if(weather_data.cod === "404"){
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        temperature.innerHTML = `${Math.round(weather_data.main.temp)}°C`;
        description.innerHTML = weather_data.weather[0].description;

        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

        switch(weather_data.weather[0].main){
            case 'Clouds':
                weather_img.src = "./assets/cloud.png";
                break;
            case 'Clear':
                weather_img.src = "./assets/clear.png";
                break;
            case 'Rain':
                weather_img.src = "./assets/rain.png";
                break;
            case 'Mist':
                weather_img.src = "./assets/mist.png";
                break;
            case 'Snow':
                weather_img.src = "./assets/snow.png";
                break;
            default:
                weather_img.src = "./assets/cloud.png";
                break;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
    }
}


searchBtn.addEventListener('click', ()=>{
    checkWeather(inputBox.value);
});

inputBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});