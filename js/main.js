// ========= 7Timer CONFIG =========
const API_BASE = "http://www.7timer.info/bin/astro.php?lon=113.17&lat=23.09&ac=0&lang=en&unit=metric&output=internal&tzshift=0";
const PRODUCT = "civillight"; // daily civil forecast, returns JSON

// ========= DOM ELEMENTS ==========
const citySelect = document.getElementById("citySelect");
const forecastContainer = document.getElementById("forecast");
const statusEl = document.getElementById("status");

let cities = [];

// Load list of cities from local JSON, then load forecast
document.addEventListener("DOMContentLoaded", () => {
  loadCities();
});

async function loadCities() {
  try {
    statusEl.textContent = "Loading cities...";
    const res = await fetch("cities.json");
    if (!res.ok) throw new Error("Unable to load cities list");
    const data = await res.json();      // local JSON
    cities = data.cities;

    populateCitySelect(cities);
    statusEl.textContent = "";

    if (cities.length > 0) {
      getWeatherForCity(cities[0].id);  // default city
    }

    citySelect.addEventListener("change", () => {
      getWeatherForCity(citySelect.value);
    });
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error loading city list.";
  }
}

function populateCitySelect(cities) {
  citySelect.innerHTML = "";
  cities.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    citySelect.appendChild(opt);
  });
}

async function getWeatherForCity(cityId) {
  const city = cities.find((c) => c.id === cityId);
  if (!city) return;

  statusEl.textContent = "Fetching 7-day forecast...";
  forecastContainer.innerHTML = "";

  const url =
    `${API_BASE}?lon=${city.lon}&lat=${city.lat}` +
    `&product=${PRODUCT}&output=json`;

  try {
    const res = await fetch(url);      // async call to 7Timer API
    if (!res.ok) throw new Error("API error");
    const data = await res.json();     // JSON from 7Timer

    // civillight returns an array of days in data.dataseries
    const days = (data.dataseries || []).slice(0, 7);
    renderForecast(days, city.name);

    statusEl.textContent = `7 day forecast for ${city.name}`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error fetching weather data.";
  }
}

// Turn API JSON into cards on the page
function renderForecast(days, cityName) {
  forecastContainer.innerHTML = "";

  days.forEach((day) => {
    const dateLabel = formatDate(day.date);
    const emoji = pickEmoji(day.weather);
    const desc = formatWeatherDescription(day.weather);
    const temp = day.temp2m; // civillight gives a single daily temp in °C

    const card = document.createElement("article");
    card.className = "forecast-card";

    card.innerHTML = `
      <div class="forecast-date">${dateLabel}</div>
      <div class="forecast-icon">${emoji}</div>
      <div class="forecast-desc">${desc}</div>
      <div class="forecast-temp">
        Temp: ${Math.round(temp)}°C<br/>
        Wind: ${day.windspeed || "–"} km/h
      </div>
    `;

    forecastContainer.appendChild(card);
  });

  if (!days.length) {
    forecastContainer.innerHTML =
      `<p>No forecast data available for ${cityName}.</p>`;
  }
}

// Helpers

function formatDate(dateValue) {
  if (!dateValue) return "";
  let d;

  // handle "2022-01-01" or "20220101"
  if (typeof dateValue === "string" && dateValue.includes("-")) {
    d = new Date(dateValue);
  } else {
    const s = String(dateValue);
    const year = Number(s.slice(0, 4));
    const month = Number(s.slice(4, 6)) - 1; // 0-based
    const day = Number(s.slice(6, 8));
    d = new Date(year, month, day);
  }

  const opts = { weekday: "short", month: "short", day: "numeric" };
  return d.toLocaleDateString(undefined, opts);
}

function pickEmoji(code = "") {
  const c = code.toLowerCase();
  if (c.includes("clear")) return "☀️";
  if (c.includes("pcloudy") || c.includes("mcloudy")) return "⛅";
  if (c.includes("cloudy")) return "☁️";
  if (c.includes("rain")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("ts")) return "⛈️";
  if (c.includes("fog")) return "🌫️";
  if (c.includes("wind")) return "💨";
  return "🌤️";
}

function formatWeatherDescription(code = "") {
  const c = code.toLowerCase();
  const map = {
    clear: "Clear",
    clearday: "Clear",
    clearnight: "Clear",
    pcloudy: "Partly cloudy",
    mcloudy: "Mostly cloudy",
    cloudy: "Cloudy",
    rainy: "Rain",
    rain: "Rain",
    lightrain: "Light rain",
    oshower: "Occasional showers",
    ishower: "Isolated showers",
    snow: "Snow",
    lightsnow: "Light snow",
    rainsnow: "Rain & snow",
    ts: "Thunderstorm",
    tsrain: "Thunderstorm with rain",
    fog: "Fog",
    humid: "Humid",
    windy: "Windy"
  };
  return (map[c] || code || "N/A").toUpperCase();
}
