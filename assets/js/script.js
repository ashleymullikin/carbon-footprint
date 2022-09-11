// example json
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

let co2Report = {};

const calculateBtn = document.querySelector("#calculate-btn");

calculateBtn.click(event => { 
    event.preventDefault();
   
    // get input
    const vehicleYear = document.querySelector("#vehicle-year").value;
    const vehicleMake = document.querySelector("#vehicle-make").value;
    const vehicleModel = document.querySelector("#vehicle-model").value;
    const miles = document.querySelector("#miles-driven").value;
    const vehicleId = vehicleYear + "-" + vehicleMake + "-" + vehicleModel;

    // call api to calculate co2 footprint
    const co2 = 0;

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

    window.localStorage.setItem("co2Report", co2Report);

});

var milesDriven = 100;
var make = "Ford";
var model = "Thunderbird";
var year = 1995;

// fetches vehicle_make_id for next fetch
var getVehicleMakeId = function(make) {
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
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);

                    // returns the index of the matching make
                    var index = data.map(function(data) {
                        return data.data.attributes.name ===make;
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
var getVehicleId = function(makerId) {
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
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);

                    // returns array of matching models
                    var modelArray = data.filter(function(data) {
                        return data.data.attributes.name === model;
                    });
                    console.log(modelArray);
                    if (!modelArray) {
                        console.log("Error: model not found.")
                    } else {
                        var index = modelArray.map(function(data) {
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
var getCarbonFootprint = function(modelId) {
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

getVehicleMakeId(make);
