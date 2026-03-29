function showWeatherDetails(event) {
    event.preventDefault();
    const city = document.getElementById("city").value;
    const apiKey = '72a65750fad643fe9ca141143262903'; // Your WeatherAPI key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) throw new Error('City not found');
        return response.json();
    })
    .then(data => {
        const weatherInfo = document.getElementById('weatherInfo');
        
        // WeatherAPI uses 'location' and 'current' objects
        weatherInfo.innerHTML = `
            <h2>Weather in ${data.location.name}, ${data.location.country}</h2>
            <p>Temperature: **${data.current.temp_c} °C**</p>
            <p>Weather: **${data.current.condition.text}**</p>
            <p>Humidity: **${data.current.humidity}%**</p>
            <p>Wind Speed: **${data.current.wind_kph} kph**</p>
            <img src="${data.current.condition.icon}" alt="weather icon">
        `;
    })
    .catch(error => {
        console.error('Error fetching weather:', error);
        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML = `<p style="color:red;">Error: ${error.message}. Please try again.</p>`;
    });
}

document.getElementById("weatherForm").addEventListener('submit', showWeatherDetails);