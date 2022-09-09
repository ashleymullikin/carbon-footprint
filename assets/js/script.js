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

const calculateBtn = $("#calculate-btn");

calculateBtn.click(event => { 
    event.preventDefault();
   
    // get input
    const vehicleYear = $("#vehicle-year").value;
    const vehicleMake = $("#vehicle-make").value;
    const vehicleModel = $("#vehicle-model").value;
    const miles = $("#miles-driven").value;
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