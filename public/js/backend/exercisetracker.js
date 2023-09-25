const postExerciseForm = document.getElementById("post-exercise-form");
const listLogsForm = document.getElementById("list-logs-form");

postExerciseForm.addEventListener("submit", () => {
const userId = document.getElementById("uid").value;
postExerciseForm.action = `/projects/backend/exercise-tracker/api/users/${userId}/exercises`;

postExerciseForm.submit();
});

listLogsForm.addEventListener("submit", () => {
debugger;
const userId = document.getElementById("userid").value;
const fromDate = document.getElementById("from").value;
const toDate = document.getElementById("to").value;
const limit = document.getElementById("limit").value;
let url = "";

if(fromDate !== "" && toDate !== "") {
    if(limit !== "") {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?from=${fromDate}&to=${toDate}&limit=${limit}`
    }
    else {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?from=${fromDate}&to=${toDate}`
    }
}
else if(toDate !== "") {
    if(limit !== "") {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?to=${toDate}&limit=${limit}`
    }
    else {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?&to=${toDate}`
    }
}
else if(fromDate !== "") {
    if(limit !== "") {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?from=${fromDate}&limit=${limit}`
    }
    else {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?&from=${fromDate}`
    }
}
else if(limit !== "") {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs?limit=${limit}`
}
else {
    url = `/projects/backend/exercise-tracker/api/users/${userId}/logs`
}

listLogsForm.action = url;

listLogsForm.submit();
});