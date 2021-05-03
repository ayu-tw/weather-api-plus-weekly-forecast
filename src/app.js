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
  cityName.innerHTML = `${response.data.name}`;
  let description = document.querySelector("#local-weather-description");
  description.innerHTML = `${
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1)
  }`;
  let temp = document.querySelector("#current-temp");
  let temperature = Math.round(response.data.main.temp);
  temp.innerHTML = `${temperature}`;
  currentTemperature = response.data.main.temp;
  let humidity = document.querySelector("#humidity-value");
  humidity.innerHTML = `${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  wind.innerHTML = `${windSpeed} km/h`;
  let localTime = document.querySelector("#local-time");
  localTime.innerHTML = formatDate(response.data.dt * 1000);
  let sunriseTime = document.querySelector("#sunrise-time");
  sunriseTime.innerHTML = sunUpDown(response.data.sys.sunrise * 1000);
  let sunsetTime = document.querySelector("#sunset-time");
  sunsetTime.innerHTML = sunUpDown(response.data.sys.sunset * 1000);
  let weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("alt", `${response.data.weather[0].description}`);
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

let search = document.querySelector("#submit-button");
search.addEventListener("click", handleSubmit);

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

let currentTemperature = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", displayFahrenheitTemp);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", displayCelsiusTemp);

searchCity("Taipei");
