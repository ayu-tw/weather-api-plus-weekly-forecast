function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "Mai",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novemebr",
    "December",
  ];
  let thisMonth = months[date.getMonth()];
  let today = date.getDate();
  let thisYear = date.getFullYear();
  return `${weekday}, ${thisMonth} ${today}, ${thisYear} ${hours}:${minutes}`;
}

function sunUpDown(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getUTCHours();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function updateCurrentInfo(response) {
  let cityName = document.querySelector("#selected-city");
  let description = document.querySelector("#local-weather-description");

  let temp = document.querySelector("#current-temp");
  let temperature = Math.round(response.data.main.temp);
  let humidity = document.querySelector("#humidity-value");
  let wind = document.querySelector("#wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  let localTime = document.querySelector("#local-time");
  let sunriseTime = document.querySelector("#sunrise-time");
  let sunsetTime = document.querySelector("#sunset-time");
  let weatherIcon = document.querySelector("#weather-icon");
  let iconElement = document.querySelector("#weather-icon");
  cityName.innerHTML = `${response.data.name}`;
  description.innerHTML = `${
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1)
  }`;
  temp.innerHTML = `${temperature}`;
  currentTemperature = response.data.main.temp;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${windSpeed} km/h`;
  localTime.innerHTML = formatDate(response.data.dt * 1000);
  sunriseTime.innerHTML = sunUpDown(response.data.sys.sunrise * 1000);
  sunsetTime.innerHTML = sunUpDown(response.data.sys.sunset * 1000);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", `${response.data.weather[0].description}`);

  getWeeklyForecast(response.data.coord);
}

function getWeeklyForecast(coordinates) {
  let apiKey = "05348ae2e09beca97cb2165f14ee5d2b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(weeklyForecast);
}

function searchCity(city) {
  let apiKey = "05348ae2e09beca97cb2165f14ee5d2b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateCurrentInfo);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input");
  searchCity(city.value);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let fahrenheitTemp = (currentTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  temperatureElement.innerHTML = Math.round(currentTemperature);
}

function weeklyForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#six-day-forecast");
  let forecastHTML = `  <div class="row">`;
  let days = response.data.daily;
  days.forEach(function (forecasting, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="day-of-week">
        ${formatDay(forecasting.dt)}
      </div>
      <img src="http://openweathermap.org/img/wn/${
        forecasting.weather[0].icon
      }@2x.png" alt="${forecasting.weather[0].description}">
      <div class="temperature-the-day">
        <span class="temperature-the-day-max">
        ${Math.round(forecasting.temp.max)}
        </span>
        <span class="temperature-the-day-min">
        ${Math.round(forecasting.temp.min)}
        </span>
      </div>
    </div>
 `;
    }
  });

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }

  forecastHTML = forecastHTML + ` </div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

let search = document.querySelector("#submit-button");
search.addEventListener("click", handleSubmit);

let currentTemperature = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", displayFahrenheitTemp);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", displayCelsiusTemp);

searchCity("Taipei");
