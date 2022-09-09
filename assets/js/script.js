// grabs make submitted by user
// var make = document.querySelector("#make");
var make = "Ford";

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
                        return data.data.attributes.name;
                    }).indexOf(make);

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
                });
            } else {
                console.log("error2");
            }
        });
};

// var getCarbonFootprint = function(distance, vehicleModelId) {
//     fetch("https://www.carboninterface.com/api/v1/estimates", {
//         body: "{",
//         headers: {
//             Authorization: "cQlfP6SSNrGwCXsdj2iq9w",
//             "Content-Type": "application/json"
//         },
//         method: "POST"
//     })
// }

// TODO API CALL vehicle_model_id
// accepts

// TODO API CALL type-vehicle
// accepts distance_value, distance_unit, vehicle_model_id
// returns carbon weight

getVehicleMakeId(make);