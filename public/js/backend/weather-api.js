'use strict';
const URL = "https://weather-proxy.freecodecamp.rocks";
const weatherButton = document.getElementById('getWeatherBtn');
const errorMessages = document.getElementById('error');
const result = document.getElementById('result');
const x = document.getElementById('result');
const Farbutton = document.getElementById("tof")
const Celbutton = document.getElementById("toc")
let displayed = false;
const form = document.getElementById('locationForm');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevents the page from reloading on form submission
  const lat = document.getElementById('latitude').value;
  const lon = document.getElementById('longitude').value;
  
  try {
    if(displayed) {
      cleanPreviousResults();
    }
    getLocation(lat, lon);
  } catch (error) {r
    console.log(error);
    errorMessages.innerHTML = error.message;
  } 
});

weatherButton.addEventListener('click', () => {
  try {
    if(displayed) {
      cleanPreviousResults();
    }
    getLocation();
  } catch (error) {
    console.log(error);
    errorMessages.innerHTML = error.message;
  } 
});

function cleanPreviousResults() {
  if (result.hasChildNodes()) {
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }
  }
  Farbutton.style.display = "none"
  Celbutton.style.display = "none"
  result.style.display = "none";
}

function getLocation(lat = null, lon = null) {
  if(lat && lon) {
    let pos = {
      coords: {
        latitude: lat,
        longitude: lon
      }
    }
    showPosition(pos)
  }
  else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    errorMessages.innerHTML = "Geolocation is not supported by this browser.";
  }
}

async function showPosition(position) {
  const { latitude, longitude } = position.coords;
  let apiURL = `${URL}/api/current?lat=${latitude}&lon=${longitude}`
  
  let data = await getData(apiURL)
  console.log(data)
  
  buildResult(data)
  
  
  
}

async function getData(url) {
  try {
    let response = await fetch(url)
    console.log(response)
    let jsonData = await response.json()
    return jsonData
  }
  catch(e) {
    console.log(e)
    return e
  }
}

function buildResult(data) {
  const { main, icon } = data.weather[0];
  const { temp, feels_like } = data.main;
  
  let Hmain = document.createElement("span")
  Hmain.innerHTML = `${main} in ${data.name}<r>`
  let Htemp = document.createElement("span")
  Htemp.innerHTML = `<br>Temperature: ${temp}°C<br>`
  let Hfeels_like = document.createElement("span")
  Hfeels_like.innerHTML = `Felt: ${feels_like}°C<br>`
  let img = document.createElement("img")
  img.src = data.weather[0].icon
  
  updateBackground(temp)
  
  
  Farbutton.style.display = "block";
  
  Farbutton.addEventListener('click', () => {
    Hfeels_like.innerHTML = `Felt: ${Math.round((feels_like * 1.8) + 32)}°F<br>`
    Htemp.innerHTML = `<br>Temperature: ${Math.round((temp * 1.8) + 32)}°F<br>`
    Farbutton.style.display = "none"
    Celbutton.style.display = "block"
  })
  
  Celbutton.addEventListener('click', () => {
      Hfeels_like.innerHTML = `Felt: ${feels_like}°C<br>`
      Htemp.innerHTML = `<br>Temperature: ${temp}°C<br>`
      Celbutton.style.display = "none"
      Farbutton.style.display = "block"
    })
  
  
  result.appendChild(Hmain)
  result.appendChild(img)
  result.appendChild(Htemp)
  result.appendChild(Hfeels_like)
  result.style.display = "block";
  
  displayed = true;
}

function updateBackground(t) {
      let color = '';
      let src = "";

      if (t >= 30) {
        src = 'url(/images/backend/heatwave.jpg)'; // Red background for temperatures above 30°C
      } else if (t >= 20) {
        src = 'url(/images/backend/sunshine.jpg)'; // Orange background for temperatures between 20°C and 30°C
      } else if (t >= 10) {
        src = 'url(/images/backend/rain.jpg)'; // Yellow background for temperatures between 10°C and 20°C
      } else if (t >= 0) {
        src = "url(/images/backend/cold.jpg)"
      } else {
        src = "url(/images/backend/freezing.webp)"
      }

      const container = document.body
      container.style.backgroundImage = src;
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center';
      container.style.backgroundRepeat = 'no-repeat';
}