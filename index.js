// ELEMENTOS
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const currentSection = document.getElementById("current");
const hourlySection = document.getElementById("hourly");
const dailySection = document.getElementById("daily");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return;
  getCoordinates(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

async function getCoordinates(city) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city,
    )}&count=1&language=es&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("Ciudad no encontrada");
      return;
    }

    const { latitude, longitude, name, country } = data.results[0];
    getWeather(latitude, longitude, name, country);
  } catch (error) {
    console.error(error);
    alert("Error al buscar la ciudad");
  }
}

async function getWeather(lat, lon, city, country) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    renderCurrent(data.current_weather, city, country);
    renderHourly(data.hourly);
    renderDaily(data.daily);
  } catch (error) {
    console.error(error);
    alert("Error al obtener el clima");
  }
}

function renderCurrent(current, city, country) {
  currentSection.innerHTML = `
    <h2 class="section-title">
      <span class="icon">☀️</span>
      ${city}, ${country}
    </h2>

    <div class="weather-row">
      <span>Temperatura</span>
      <span>${current.temperature} °C</span>
    </div>

    <div class="weather-row">
      <span>Viento</span>
      <span>${current.windspeed} km/h</span>
    </div>
  `;
}

function renderHourly(hourly) {
  hourlySection.innerHTML = `
    <h2 class="section-title">
      <span class="icon">🕒</span>
      Próximas horas
    </h2>
  `;

  for (let i = 0; i < 6; i++) {
    hourlySection.innerHTML += `
      <div class="weather-row">
        <span>${hourly.time[i].slice(11, 16)}</span>
        <span>${hourly.temperature_2m[i]} °C</span>
      </div>
    `;
  }
}

function renderDaily(daily) {
  dailySection.innerHTML = `
    <h2 class="section-title">
      <span class="icon">📆</span>
      Próximos días
    </h2>
  `;

  for (let i = 0; i < daily.time.length; i++) {
    dailySection.innerHTML += `
      <div class="weather-row">
        <span>${daily.time[i]}</span>
        <span>
          ${daily.temperature_2m_min[i]}° / ${daily.temperature_2m_max[i]}°
        </span>
      </div>
    `;
  }
}
