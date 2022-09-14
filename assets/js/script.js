// below commented code only valid for future developmentof the app using historical data
/*
{
    "daily": [
      {
        "day": "2022-09-09",
        "vehicleMake": "Honda",
        "vehicleModel": "HRV",
        "vehicleYear": 2020,
        "vehicleYearId": "2022-Honda-HRV"
        "miles": 15,
        "co2" : 3
      },
      {
        "day": "2022-09-10",
        "vehicleMake": "Honda",
        "vehicleModel": "HRV",
        "vehicleYear": 2020,
        "vehicleYearId": "2022-Honda-HRV"
        "miles": 25,
        "co2" : 4
      }
    ]
  }
*/

const makeSelect = document.querySelector("#make");
const modelSelect = document.querySelector("#model");
const yearSelect = document.querySelector("#year");
const resultsEl = document.querySelector("#results");

// called when page loads
var loadPreviousSearch = function () {
  // populates the form with the last search information if exists on initial page load
  const lastSearchStr = window.localStorage.getItem("lastSearch");
  if (lastSearchStr) {
    const lastSearch = JSON.parse(lastSearchStr);
    // select make in dropdown
    const options = Array.from(makeSelect.options);
    const optionToSelect = options.find(item => item.text === lastSearch.make);
    if (optionToSelect) {
      optionToSelect.selected = true;
      // add model option
      const opt = document.createElement('option');
      opt.value = lastSearch.model;
      opt.innerHTML = lastSearch.model;
      opt.selected = true;
      modelSelect.appendChild(opt);
      // add year option
      const opt2 = document.createElement('option');
      opt2.value = lastSearch.vehicleId;
      opt2.innerHTML = lastSearch.year;
      opt2.selected = true;
      yearSelect.appendChild(opt2);
    }
  }
}

var calculate = function () {
  // calculate miles for a year
  const miles = document.querySelector("#milesDriven").value;
  const vehicleId = document.querySelector("#year").value;
  const make = makeSelect.options[makeSelect.selectedIndex].text;
  const model = modelSelect.options[modelSelect.selectedIndex].text;
  const year = yearSelect.options[yearSelect.selectedIndex].text;

  // this is all 4 inputs validation 
  if (inputErrorHandler(miles, make, model, year)) {
    // save search locally
    const lastSearch = { vehicleId: vehicleId, make: make, model: model, year: year };
    window.localStorage.setItem("lastSearch", JSON.stringify(lastSearch));

    // store rolling daily everage miles
    const milesAvgStr = window.localStorage.getItem("rollingAvg");
    // rolling miles average to track cumulative miles and number of inputs
    // rollingMiles - tracks cumulative miles of all the calculations
    // numOfInputs -  tracks number of calculations
    // used to calculate average miles driven daily to display yearly average co2
    let rollingMilesAvg = { rollingMiles: 0, numOfInputs: 0 };
    if (milesAvgStr) {
      rollingMilesAvg = JSON.parse(milesAvgStr);
    }
    // increase rolling average numbers and calculate the average daily miles
    rollingMilesAvg.rollingMiles += parseInt(miles);
    rollingMilesAvg.numOfInputs += 1;
    const milesAvg = rollingMilesAvg.rollingMiles / rollingMilesAvg.numOfInputs;
    window.localStorage.setItem('rollingAvg', JSON.stringify(rollingMilesAvg));

    var apiUrl = "https://www.carboninterface.com/api/v1/estimates";
    var headers = {
      headers: {
        Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "type": "vehicle",
        "distance_unit": "mi",
        "distance_value": milesAvg * 365, // per year
        "vehicle_model_id": vehicleId
      }),
      method: "POST"
    };
    try {
      fetch(apiUrl, headers)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              // store rolling daily miles average after successful calculation
              window.localStorage.setItem('rollingAvg', JSON.stringify(rollingMilesAvg));
              const co2 = data.data.attributes.carbon_mt;
              let co2El = document.createElement("div");
              co2El.textContent = data.data.attributes.carbon_mt + ' metric tonnes';
              // build indicatator based on national average of 4.6
              let indicator = "";
              if (co2 > 4.6) {
                indicator = "over";
              } else if (co2 < 4.6) {
                indicator = "under";
              } else {
                indicator = "same";
              }
              co2El.id = indicator;
              resultsEl.appendChild(co2El);
            });
          } else {
            // displays error on the form
            displayError(response.statusText);
          }
        });
    } catch (e) {
      displayError(e.message);
    }
  }
};

var inputErrorHandler = function (miles, make, model, year) {
  let valid = true;
  if (miles == null || miles.trim().length == 0 || isNaN(miles) || parseInt(miles) <= 0) {
    valid = false;
  }
  // validate make/model/year is entered
  if (make === '--- Select Make ---' || model === '--- Select Model ---' || year === '--- Select Year ---') {
    valid = false;
  }
  if (!valid) {
    var errorEl = document.createElement("p");
    errorEl.innerHTML = "Error: Invalid entry or not all fields are selected." 
    var calculateBtn = document.querySelector("#calculate");
    calculateBtn.appendChild(errorEl);
    setTimeout(function () {
      calculateBtn.removeChild(calculateBtn.firstElementChild);
    }, 3000);
    return valid;
  }
  return valid;
}

// sort array alphabetically
var sortOptionArray = function (array) {
  array.sort((a, b) => {
    const textA = a.text.toUpperCase(); // ignore upper and lowercase
    const textB = b.text.toUpperCase(); // ignore upper and lowercase
    if (textA < textB) {
      return -1;
    }
    if (textA > textB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
};

// sort array by integer
var sortOptionArrayNumber = function (array) {
  array.sort((a, b) => {
    const numA = a.text;
    const numB = b.text;
    if (numA < numB) {
      return -1;
    }
    if (numA > numB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
};

// fetches vehicle makes and display
var populateVehicleMakes = function () {
  // url and headers for fetch
  var apiUrl = "https://www.carboninterface.com/api/v1/vehicle_makes";
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    }
  };
  try {
    // fetches list of all car makers to get id
    fetch(apiUrl, headers)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            // get vehicle makes, sort it and then display
            var optionArray = [];
            data.forEach(function (item, index) {
              optionArray.push({ text: item.data.attributes.name, value: item.data.id });
            });
            sortOptionArray(optionArray);
            optionArray.forEach(function (item, index) {
              var opt = document.createElement('option');
              opt.value = item.value;
              opt.innerHTML = item.text;
              makeSelect.appendChild(opt);
            });
            sortOptionArray(optionArray);
            // invoke function to populate with previously searched
            loadPreviousSearch();
          });

        } else {
          // displays error on the form
          displayError(response.statusText);
        }
      });
  } catch (e) {
    displayError(e.message);
  }
};

// fetches vehicle models based on selected make and display
var populateVehicleModels = function (sel) {
  // url and headers for fetch
  const makerId = sel.options[sel.selectedIndex].value;
  var apiUrl = "https://www.carboninterface.com/api/v1/vehicle_makes/" + makerId + "/vehicle_models"
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    }
  }
  // reset the options first
  var length = modelSelect.options.length;
  for (i = length - 1; i >= 0; i--) {
    modelSelect.options[i] = null;
  }
  var opt = document.createElement('option');
  opt.value = "selectmodel";
  opt.innerHTML = "--- Select Model ---";
  modelSelect.appendChild(opt);
  try {
    fetch(apiUrl, headers)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            var modelMap = {};
            var optionArray = [];
            // fetch all models for a make, sort and display
            data.forEach(function (item) {
              optionArray.push({ text: item.data.attributes.name, value: item.data.attributes.name, year: item.data.attributes.year, id: item.data.id });
            });
            sortOptionArray(optionArray);
            optionArray.forEach(function (item) {
              var model = item.text;
              var years = [];
              // only add model option if not encountered previously
              // store model years including vehicle id
              if (!modelMap[model]) {
                modelMap[model] = years;
                var opt = document.createElement('option');
                opt.value = item.value;
                opt.innerHTML = item.text;
                modelSelect.appendChild(opt);
              } else {
                years = modelMap[model];
              }
              // handle duplicate years returned from API
              var year = { text: item.year, vehicleId: item.id };
              var index = years.map(function (year) {
                return year.text === item.year;
              }).indexOf(true);
              if (index === -1) {
                years.push(year);
              }
            });
            // save models to later use to display years and fetch carbon footprint report
            window.localStorage.setItem("models", JSON.stringify(modelMap));
          });
        } else {
          // display error on the form
          displayError(response.statusText);
        }
      });
  } catch (e) {
    displayError(e.message);
  }
};

// populate vehicle years based on select model
var populateVehicleYears = function (sel) {
  const model = sel.options[sel.selectedIndex].value;
  // reset year options
  var length = yearSelect.options.length;
  for (i = length - 1; i >= 0; i--) {
    yearSelect.options[i] = null;
  }
  var opt = document.createElement('option');
  opt.value = "selectyear";
  opt.innerHTML = "--- Select Year ---";
  yearSelect.appendChild(opt);

  // find the saved model info and display years
  const modelMap = JSON.parse(window.localStorage.getItem("models"));
  Object.keys(modelMap).forEach(function (key) {
    if (key === model) {
      const years = modelMap[key];
      var optionArray = [];
      years.forEach(function (item, index) {
        optionArray.push({ text: item.text, value: item.vehicleId });
      });
      // sort years
      sortOptionArrayNumber(optionArray);
      optionArray.forEach(function (item, index) {
        var opt = document.createElement('option');
        opt.value = item.value;
        opt.innerHTML = item.text;
        yearSelect.appendChild(opt);
      });
      return;
    }
  });
}

var getCarbonIcon = function () {
  var apiUrl = "https://api-icons.icons8.com/publicApi/icons/icon?id=Bz5lDlSQs1I1&token=MVv9W4nWqeTGyJnlUuoi6JRTtQTYRWG4furlAMuW"
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          var iconEl = document.createElement("i");
          var spanEl = document.querySelector("#results");
          iconEl.innerHTML = data.icon.svg;
          spanEl.appendChild(iconEl);
        });
      } else {
        console.log("error4");
      }
    });
}

var displayError = function (message) {
  let errorEl = document.createElement("div");
  errorEl.textContent = message;
  errorEl.id = "over"; // default to attention color
  resultsEl.appendChild(errorEl);
}

// init with existing vehicle makes
populateVehicleMakes();
getCarbonIcon();


