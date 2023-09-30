'use strict'

function redirect() {

    let inputValue = document.getElementById("projectName").value;
    let currentUrl = window.location.href;
    let newUrl = currentUrl + "api/issues/s/" + inputValue;
    window.location.href = newUrl;
}

let button = document.getElementById("gotobtn");
button.addEventListener("click", redirect);