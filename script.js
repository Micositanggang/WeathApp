document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const weatherInfo = document.querySelector(".weather-info");
    const hourlyForecast = document.getElementById("hourly-forecast");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsMenu = document.getElementById("settings-menu");
    const lightModeBtn = document.getElementById("light-mode");
    const darkModeBtn = document.getElementById("dark-mode");
    const weatherIcon = document.getElementById("weather-icon");

    // ** Tampilkan menu setting saat tombol setting ditekan **
    settingsBtn.addEventListener("click", () => {
        settingsMenu.style.display = settingsMenu.style.display === "block" ? "none" : "block";
    });

    // ** Mode Siang & Malam **
    lightModeBtn.addEventListener("click", () => {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    });

    darkModeBtn.addEventListener("click", () => {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    });

    // ** Cek mode yang tersimpan di localStorage **
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // ** Event cari cuaca **
    searchBtn.addEventListener("click", () => {
        const cityName = cityInput.value.trim();
        if (cityName !== "") {
            getWeather(cityName);
        }
    });

    function getWeather(city) {
        const apiUrl = `https://wttr.in/${city}?format=%C|%t|%h|%w|%l`;

        fetch(apiUrl)
            .then(response => response.text())
            .then(data => {
                const [condition, temperature, humidity, wind, location] = data.split("|");

                // ** Format lokasi agar lebih rapi **
                let locationDetails = location.split(",");
                let cityName = locationDetails[0]?.trim() || "-";
                let province = locationDetails.length > 1 ? locationDetails[1]?.trim() : "-";
                let country = locationDetails.length > 2 ? locationDetails[2]?.trim() : "-";

                let formattedLocation = `${cityName}, ${province}, ${country}`;

                // ** Set icon cuaca (fallback jika gagal) **
                weatherIcon.src = `https://wttr.in/${city}_0pq_transparency=100.png`;
                weatherIcon.onerror = () => {
                    weatherIcon.src = "fallback-weather.png"; // Gambar cadangan
                };

                weatherInfo.innerHTML = `
                    <h2 id="location">${formattedLocation}</h2>
                    <img id="weather-icon" src="https://wttr.in/${city}_0pq_transparency=100.png" alt="Weather Icon">
                    <p id="description">${condition}</p>
                    <p><strong>Suhu:</strong> ${temperature}°C</p>
                    <p><strong>Kelembapan:</strong> ${humidity}%</p>
                `;

                getHourlyForecast(city);
            })
            .catch(error => {
                console.error("Error:", error);
                weatherInfo.innerHTML = "<p>Gagal mengambil data cuaca.</p>";
            });
    }

    function getHourlyForecast(city) {
        const apiUrl = `https://wttr.in/${city}?format=%C|%t|%h|%w&hours=8`;

        fetch(apiUrl)
            .then(response => response.text())
            .then(data => {
                const forecast = data.split("|");
                let forecastHtml = "";

                for (let i = 0; i < 8; i++) {
                    let hour = new Date();
                    hour.setHours(hour.getHours() + i);
                    let timeString = hour.getHours() + ":00";

                    forecastHtml += `<div class="hour">${timeString}<br> ${forecast[0]}, ${forecast[1]}</div>`;
                }

                hourlyForecast.innerHTML = forecastHtml;
            })
            .catch(error => {
                console.error("Error:", error);
                hourlyForecast.innerHTML = "<p>Gagal mengambil data prakiraan cuaca.</p>";
            });
    }
});
