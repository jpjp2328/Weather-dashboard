// Grabbing HTML syntax's
var searchFormEl = $('#searchForm');
var searchInputEl = $('#searchInput');
var forecastContainer = $('#forecastContainer');
var searchHistoryEl = $('#searchHistory');

// API Key from openweathermap.org
var key = '2c4a921d55c896205bdca23294d0393d';

function searchInput(event) {
    event.preventDefault()
    callCurrentWeatherDataAPI(searchInputEl.val())
}

//function for API calls
function callCurrentWeatherDataAPI(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${key}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        // console.log(data.coord.lon, data.coord.lat);
        cityName = data.name;
        // console.log('callCurrentWeatherDataAPI: ', cityName);
        callOneCallAPI(cityName, data.coord.lon, data.coord.lat);
        })
    .catch(error => {
        console.error('Error:', error);
    });

    return;
}

// function to call onecall for 5-day forecast
function callOneCallAPI(cityName, longitude, latitude) {
    var url = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lon=${longitude}&lat=${latitude}&appid=${key}`
    fetch(url)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(cityName, data.current);
        displayWeekForecast(data.daily)
    });
}

// Function to display current city info and conditions
function displayCurrentWeather(cityName, currentWeather) {
    $('#currentWeatherName').html(cityName); //city name
    $('#currentWeatherDate').html(moment().format('M/D/YYYY')) //date
    $('#currentWeatherIcon').attr('src', `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`); //icon of weather conditions
    $('#currentWeatherTemp').html(currentWeather.temp) //temp
    $('#currentWeatherHumidity').html(currentWeather.humidity) //humidity
    $('#currentWeatherWind').html(currentWeather.wind_speed) //wind speed
    $('#currentWeatherUV').html(currentWeather.uvi) //uv index

    $('#cityInfoContainer').css('display', 'block')
}

function displayWeekForecast(forecastData) {

    forecastContainer.html('');
    for (let index = 1; index <= 5; index++) {
        var divEl = $(`
        <div class="foreCastCard">
        <p style="font-weight: 800">${moment().clone().add(index,'days').format("M/D/YYYY")}</p>
        <img src="http://openweathermap.org/img/wn/${forecastData[index].weather[0].icon}.png" alt="forecast icon">
        <p>Temp: ${forecastData[index].temp.day}°C</p>
        <p>Wind: ${forecastData[index].wind_speed}m/s</p>
        <p>Humidity: ${forecastData[index].humidity}%</p>
        </div>`)
        divEl.appendTo(forecastContainer)
    }
}

// function to initialise events once page loads
function init() { 
    searchFormEl.submit(searchInput)
}

init()