// below commented code only valid if we decide to implement historical data
/*
{
    "daily": [
      {
        "day": "2022-09-09",
        "vehicleMake": "Honda",
        "vehicleModel": "HRV",
        "vehicleYear": 2022,
        "vehicleYearId": "2022-Honda-HRV"
        "miles": 15,
        "co2" : 3
      },
      {
        "day": "2022-09-10",
        "vehicleMake": "Honda",
        "vehicleModel": "HRV",
        "vehicleYear": 2022,
        "vehicleYearId": "2022-Honda-HRV"
        "miles": 25,
        "co2" : 4
      }
    ]
  }
*/

//let co2Report = {};

//const calculateBtn = document.querySelector("#calculate");

//calculateBtn.click(event => { 
// alert("here");
//event.preventDefault();

// get input
//const vehicleYear = document.querySelector("#vehicle-year").value;
//const vehicleMake = document.querySelector("#vehicle-make").value;
//const vehicleModel = document.querySelector("#vehicle-model").value;
//const miles = document.querySelector("#milesDriven").value;
//const vehicleId = document.querySelector("#year").value;
//alert ("miles "  + miles + " , id " + vehicleId);

// call api to calculate co2 footprint
/*const co2 = 0;

let dailyArray = [];
let co2ReportJson = window.localStorage.getItem("co2Report");
// if not empty, parse -> otherwise initialize to empty
if (co2ReportJson) {
    co2Report = JSON.parse(co2ReportJson);
} else {
    co2Report = {};
}
// create daily report if doesn't exist
if (co2Report.daily) {
    dailyArray = daily;
} else {
    dailyArray = [];
    co2Report.daily = dailyArray;
}
// TODO: If updates are allowed, then you need to find entry by date and vehicle id and update it
// add entry for daily and save
const co2DayItem = {};
co2DayItem.day = new Date().toDateString();
co2DayItem.vehicleMake = vehicleMake;
co2DayItem.vehicleModel = vehicleModel;
co2DayItem.vehicleYear = vehicleYear;
co2DayItem.miles = miles;
co2DayItem.vehicleId = vehicleId;
dailyArray.push(co2DayItem);

window.localStorage.setItem("co2Report", co2Report);*/

//});

const makeSelect = document.querySelector("#make");
const modelSelect = document.querySelector("#model");
const yearSelect = document.querySelector("#year");

var calculate = function () {
  // calculate miles for a year
  const miles = document.querySelector("#milesDriven").value * 365;
  const vehicleId = document.querySelector("#year").value;
  //alert ("miles "  + miles + " , id " + vehicleId);

  var apiUrl = "https://www.carboninterface.com/api/v1/estimates";
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "type": "vehicle",
      "distance_unit": "mi",
      "distance_value": miles,
      "vehicle_model_id": vehicleId
    }),
    method: "POST"
  };

  // IMPORTANT - leave final fetch commented out for now we are limited to 200 estimates a month

  /* fetch(apiUrl, headers)
       .then(function(response) {
           if (response.ok) {
               response.json().then(function(data) {
                   console.log(data);
                   // store last CO2 report to display by default if decide on this feature
                   // window.localStorage.setItem("lastCO2Report", JSON.stringify(data));
               });
           } else {
               console.log("error3");
           }
       });*/

};

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
        });
      } else {
        console.log("error1");
      }
    });
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
        console.log("error2");
      }
    });
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

// init with existing vehicle makes
populateVehicleMakes();

// THIS CAN BE REMOVED

/*
var milesDriven = 100;
var make = "Ford";
var model = "Thunderbird";
var year = 1995;

// fetches vehicle_make_id for next fetch
var getVehicleMakeId = function (make) {
  // url and headers for fetch
  var apiUrl = "https://www.carboninterface.com/api/v1/vehicle_makes";
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    }
  }

  // fetches list of all car makers to get id
  fetch(apiUrl, headers)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // returns the index of the matching make
          var index = data.map(function (data) {
            return data.data.attributes.name === make;
          }).indexOf(true);

          // checks if a real value is returned
          if (index === -1) {
            console.log("Error: make not found.");
          } else {
            // sets makerId and calls next fetch with data
            var makerId = data[index].data.id;
            console.log(makerId);
            getVehicleId(makerId);
          }
        });
      } else {
        console.log("error1");
      }
    });
};

// fetches rest of vehicle info using makerId
var getVehicleId = function (makerId) {
  // url and headers for fetch
  var apiUrl = "https://www.carboninterface.com/api/v1/vehicle_makes/" + makerId + "/vehicle_models"
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    }
  }

  // fetches list of all car makers to get id
  fetch(apiUrl, headers)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // returns array of matching models
          var modelArray = data.filter(function (data) {
            return data.data.attributes.name === model;
          });
          console.log(modelArray);
          if (!modelArray) {
            console.log("Error: model not found.")
          } else {
            var index = modelArray.map(function (data) {
              return data.data.attributes.year === year;
            }).indexOf(true);
            console.log(index);
            if (index === -1) {
              console.log("Error: year not found for model.")
            } else {
              var modelId = data[index].data.id;
              console.log(modelId);
              getCarbonFootprint(modelId);
            }
          }
        });
      } else {
        console.log("error2");
      }
    });
};

// fetches rest of vehicle info using makerId
var getVehicleId = function (makerId) {
  // url and headers for fetch
  var apiUrl = "https://www.carboninterface.com/api/v1/vehicle_makes/" + makerId + "/vehicle_models"
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    }
  }

  // fetches list of all car makers to get id
  fetch(apiUrl, headers)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          // returns array of matching models
          var modelArray = data.filter(function (data) {
            return data.data.attributes.name === model;
          });
          console.log(modelArray);
          if (!modelArray) {
            console.log("Error: model not found.")
          } else {
            var index = modelArray.map(function (data) {
              return data.data.attributes.year === year;
            }).indexOf(true);
            console.log(index);
            if (index === -1) {
              console.log("Error: year not found for model.")
            } else {
              var modelId = data[index].data.id;
              console.log(modelId);
              getCarbonFootprint(modelId);
            }
          }
        });
      } else {
        console.log("error2");
      }
    });
};

// fetches carbon estimate using ModelId
var getCarbonFootprint = function (modelId) {
  // url and headers for fetch
  var apiUrl = "https://www.carboninterface.com/api/v1/estimates";
  var headers = {
    headers: {
      Authorization: "Bearer cQlfP6SSNrGwCXsdj2iq9w",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "type": "vehicle",
      "distance_unit": "mi",
      "distance_value": milesDriven,
      "vehicle_model_id": modelId
    }),
    method: "POST"
  };

  // IMPORTANT - leave final fetch commented out for now we are limited to 200 estimates a month

  // fetch(apiUrl, headers)
  //     .then(function(response) {
  //         if (response.ok) {
  //             response.json().then(function(data) {
  //                 console.log(data);
  //             });
  //         } else {
  //             console.log("error3");
  //         }
  //     });

};

//getVehicleMakeId(make); */
