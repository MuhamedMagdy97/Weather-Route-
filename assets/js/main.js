const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".weather img");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const cities = document.querySelectorAll(".city");
const btn = document.querySelector(".submit");
let cityInput = "London";

cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    app.style.opacity = "0";
    console.log(cityInput);
  });
});

form.addEventListener("submit", (e) => {
  if (search.value.length === 0) {
    alert("Please type in a city");
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
    console.log(cityInput);
  }
  e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}
async function fetchWeatherData() {
  try {
    // Fetch weather data from the API
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=3796b7319bc5453290b140152241101&q=${cityInput}`,
      );
    const data = await response.json();
    console.log(data);

    // Display weather information
    displayWeather(data);
  } catch (error) {
    // Handle errors during data fetching
    console.error("Error fetching weather data:", error);
    alert("City not found, please try again");
    app.style.opacity = "1";
  }
}

function displayWeather(data) {
  // Update HTML elements with weather information
  temp.innerHTML = data.current.temp_c + "&#176";
  conditionOutput.innerHTML = data.current.condition.text;

  const date = data.location.localtime;
  const y = parseInt(date.substr(0, 4));
  const m = parseInt(date.substr(5, 2));
  const d = parseInt(date.substr(8, 2));
  const time = date.substr(11);

  // Display date and time
  dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
  timeOutput.innerHTML = time;
  nameOutput.innerHTML = data.location.name;

  // Set icon source
  const iconId = data.current.condition.icon.substr(
    "cdn.weatherapi.com/weather/64x64/"
  );
  icon.src = iconId;

  console.log("this icon id" + " " + iconId)

  console.log("this icon src" + " " + icon.src)

  // Display additional weather information
  cloudOutput.innerHTML = data.current.cloud + "%";
  humidityOutput.innerHTML = data.current.humidity + "%";
  windOutput.innerHTML = data.current.wind_kph + "km/h";

  let timeOfDay = "day";
  const code = data.current.condition.code;

  // Determine background and button colors based on weather code
  if (!data.current.is_day) {
    timeOfDay = "night";
  }

  if (code == 1000) {
    app.style.backgroundImage = `url(assets/images/${timeOfDay}/clear.jpg)`;
    btn.style.background = timeOfDay === "night" ? "#181e27" : "#e5ba92";
  } else if (
    [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(
      code
    )
  ) {
    app.style.backgroundImage = `url(assets/images/${timeOfDay}/clear.jpg)`;
    btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
  } else {
    // Set background image and button color for other weather conditions
    const backgroundImagePath =
      code == 1063 ||
      code == 1069 ||
      code == 1072 ||
      code == 1150 ||
      code == 1153 ||
      code == 1180 ||
      code == 1183 ||
      code == 1186 ||
      code == 1189 ||
      code == 1192 ||
      code == 1195 ||
      code == 1204 ||
      code == 1207 ||
      code == 1240 ||
      code == 1243 ||
      code == 1246 ||
      code == 1249 ||
      code == 1252
        ? "rainy.jpg"
        : "snowy.jpg";

    app.style.backgroundImage = `url(assets/images/${timeOfDay}/${backgroundImagePath})`;
    btn.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4dd72aa";
  }

  app.style.opacity = "1";
}
