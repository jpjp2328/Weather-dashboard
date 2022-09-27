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
        cityName = data.name;
        callOneCallAPI(cityName, data.coord.lon, data.coord.lat);
        displaySearchHistory(cityName,false);
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

    // uv index colour change depending on value
    if (currentWeather.uvi > 6) {
        $('#currentWeatherUV').css('background', '#cc0000')
    } else if (currentWeather.uvi > 4) {
        $('#currentWeatherUV').css('background', '#ffcc00')
    } else {
        $('#currentWeatherUV').css('background', '#33cc33')
    }

}

// Function to display 5 day forecast for selected city
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

// Function for Search history using local storage
function displaySearchHistory(cityName, initialStart) {

    var matchFound = false;
    $('#searchHistory').children('').each(function(i) {
        if (cityName == $(this).text()) {
            matchFound = true;
            return;
        }
    });
    if (matchFound) {return;}

    var buttonEl = $(`<button type="button" class="col-12 mt-3 btn btn-secondary">${cityName}</button>`)
    buttonEl.on('click', previousButtonClick);
    buttonEl.prependTo(searchHistoryEl);

    var clearHistoryBtn = $('#clearHistoryBtn')
    clearHistoryBtn.on('click',clearLocalStorage)

    if (!initialStart) {savePreviousData(cityName)};
}


function savePreviousData(cityName) {
    tempItem = JSON.parse(localStorage.getItem('searchHistory'))
    if (tempItem != null) {
        localStorage.setItem('searchHistory', JSON.stringify(tempItem.concat(cityName)))
    } else {
        tempArr = [cityName];
        localStorage.setItem('searchHistory', JSON.stringify(tempArr))
    }
}

function previousButtonClick(event) {
    callCurrentWeatherDataAPI(event.target.innerHTML)
}

// Clear History Function

function clearLocalStorage() {

    var searchHistoryEl = $('#searchHistory');
  
    localStorage.removeItem("searchHistory");
    searchHistoryEl.innerHTML = '';
  
    return;
}

// function to initialise events once page loads
function init() { 
    searchFormEl.submit(searchInput)
    tempArr = JSON.parse(localStorage.getItem('searchHistory'))
    if (tempArr != null){
        for (let index = 0; index < tempArr.length; index++) {
            displaySearchHistory(tempArr[index], true)
        }
    }
}

init()