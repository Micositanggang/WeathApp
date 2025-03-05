async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    const geocodeUrl = `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`;

    try {
        const geoResponse = await fetch(geocodeUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            document.getElementById("weatherResult").innerHTML = "<p>❌ City not found!</p>";
            document.getElementById("weatherResult").classList.remove("show");
            return;
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const cityName = geoData[0].display_name;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const temp = weatherData.current_weather.temperature;
        const windSpeed = weatherData.current_weather.windspeed;
        const weatherDesc = weatherData.current_weather.weathercode;

        const weatherDescriptions = {
            0: "Clear",
            1: "Partly Cloudy",
            2: "Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Freezing Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Heavy Drizzle",
            61: "Light Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Light Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Light Local Rain",
            81: "Moderate Local Rain",
            82: "Heavy Local Rain"
        };
        const weatherText = weatherDescriptions[weatherDesc] || "Unknown Weather Condition";

        document.getElementById("weatherResult").innerHTML = `
            <h3>${cityName}</h3>
            <p>🌍 Coordinates: ${lat}, ${lon}</p>
            <p>🌡️ Temperature: ${temp}°C</p>
            <p>🌬️ Wind Speed: ${windSpeed} km/h</p>
            <p>⛅ Weather Description: ${weatherText}</p>
        `;

       
        document.getElementById("weatherResult").classList.add("show");

    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById("weatherResult").innerHTML = "<p>❌ Failed to fetch weather data!</p>";
        document.getElementById("weatherResult").classList.remove("show");
    }
}


function toggleMode() {
    document.body.classList.toggle("dark-mode");

    const modeButton = document.querySelector(".mode-toggle");
    if (document.body.classList.contains("dark-mode")) {
        modeButton.textContent = "☀️ Day Mode";
    } else {
        modeButton.textContent = "🌙 Night Mode";
    }
}


function setModeAutomatically() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
        document.body.classList.add("dark-mode");
        document.querySelector(".mode-toggle").textContent = "☀️ Day Mode";
    } else {
        document.body.classList.remove("dark-mode");
        document.querySelector(".mode-toggle").textContent = "🌙 Night Mode";
    }
}

window.onload = setModeAutomatically;
