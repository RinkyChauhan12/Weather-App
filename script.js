async function getWeather() {

    let cityInput = document.getElementById("cityInput");

    let city = cityInput.value.trim();

    let error = document.getElementById("error");


    // Check empty input

    if (city === "") {

        error.textContent = "Please enter a city name.";

        return;
    }


    try {

        error.textContent = "";


        // Find city coordinates

        let locationResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name="
            + encodeURIComponent(city)
            + "&count=1&language=en&format=json"
        );


        let locationData = await locationResponse.json();


        if (!locationData.results) {

            error.textContent = "City not found.";

            return;
        }


        let location = locationData.results[0];

        let latitude = location.latitude;

        let longitude = location.longitude;

        let cityName = location.name;


        // Get weather

        let weatherResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude="
            + latitude
            + "&longitude="
            + longitude
            + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
        );


        let weatherData = await weatherResponse.json();


        let current = weatherData.current;


        // Temperature

        document.getElementById("temperature").textContent =
            current.temperature_2m + "°C";


        // City

        document.getElementById("cityName").textContent =
            cityName;


        // Humidity

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";


        // Wind

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";


        // Weather condition

        let condition = getWeatherCondition(
            current.weather_code
        );


        document.getElementById("condition").textContent =
            condition.text;


        document.getElementById("weatherIcon").textContent =
            condition.icon;

    }

    catch (error) {

        document.getElementById("error").textContent =
            "Something went wrong. Please try again.";

        console.log(error);

    }

}


// Convert weather code into condition

function getWeatherCondition(code) {

    if (code === 0) {

        return {
            text: "Clear Sky",
            icon: "☀️"
        };

    }

    else if (code >= 1 && code <= 3) {

        return {
            text: "Partly Cloudy",
            icon: "⛅"
        };

    }

    else if (code >= 45 && code <= 48) {

        return {
            text: "Foggy",
            icon: "🌫️"
        };

    }

    else if (code >= 51 && code <= 67) {

        return {
            text: "Rainy",
            icon: "🌧️"
        };

    }

    else if (code >= 71 && code <= 77) {

        return {
            text: "Snowy",
            icon: "❄️"
        };

    }

    else if (code >= 80 && code <= 82) {

        return {
            text: "Rain Showers",
            icon: "🌦️"
        };

    }

    else if (code >= 95) {

        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };

    }

    else {

        return {
            text: "Unknown",
            icon: "🌤️"
        };

    }

}