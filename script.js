async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Masukkan nama kota!");
        return;
    }

    const geocodeUrl = `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`;

    try {
        const geoResponse = await fetch(geocodeUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            document.getElementById("weatherResult").innerHTML = "<p>❌ Kota tidak ditemukan!</p>";
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
            0: "Cerah",
            1: "Sebagian Berawan",
            2: "Berawan",
            3: "Mendung",
            45: "Kabut",
            48: "Kabut Beku",
            51: "Gerimis Ringan",
            53: "Gerimis Sedang",
            55: "Gerimis Lebat",
            61: "Hujan Ringan",
            63: "Hujan Sedang",
            65: "Hujan Lebat",
            71: "Salju Ringan",
            73: "Salju Sedang",
            75: "Salju Lebat",
            80: "Hujan Lokal Ringan",
            81: "Hujan Lokal Sedang",
            82: "Hujan Lokal Lebat"
        };
        const weatherText = weatherDescriptions[weatherDesc] || "Cuaca Tidak Diketahui";

        document.getElementById("weatherResult").innerHTML = `
            <h3>${cityName}</h3>
            <p>🌍 Koordinat: ${lat}, ${lon}</p>
            <p>🌡️ Suhu: ${temp}°C</p>
            <p>🌬️ Angin: ${windSpeed} km/h</p>
            <p>⛅ Deskripsi Cuaca: ${weatherText}</p>
        `;

        // Tampilkan hasil cuaca
        document.getElementById("weatherResult").classList.add("show");

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        document.getElementById("weatherResult").innerHTML = "<p>❌ Gagal mengambil data cuaca!</p>";
        document.getElementById("weatherResult").classList.remove("show");
    }
}

// Fungsi Toggle Mode Siang/Malam
function toggleMode() {
    document.body.classList.toggle("dark-mode");

    const modeButton = document.querySelector(".mode-toggle");
    if (document.body.classList.contains("dark-mode")) {
        modeButton.textContent = "☀️ Daytime Mode";
    } else {
        modeButton.textContent = "🌙 Night Mode";
    }
}

// Set mode otomatis berdasarkan waktu
function setModeAutomatically() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
        document.body.classList.add("dark-mode");
        document.querySelector(".mode-toggle").textContent = "☀️ Daytime Mode";
    }
}

// Jalankan saat halaman dimuat
window.onload = setModeAutomatically;
