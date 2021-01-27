const Observable = require("tns-core-modules/data/observable").Observable;
const StoredProcedure = require("~/core/storedprocedure");

function TravelListModel(){
    const viewModel = new Observable();

    viewModel.set("hasImage", global.hasImage);

    viewModel.ImageToggle = function() {
        viewModel.set("hasImage", global.hasImage);
    } 

    viewModel.SaveTravelDetails = (async (travelObj) =>{
        return new Promise((resolve, reject) =>{
            StoredProcedure.execute("addTravelDetails.sql", travelObj).then((response) =>{
                global.imgAsset = "";

                resolve({ Status: 1, Message: "Travel details successfully saved."});
            }).catch((err) => {
                // ShowMessage("Error", "An unexpected error encountered while processing your request.", "error");
                resolve({ Status: 2, Message: `An unexpected error encountered while processing your request. (${err})` });
            });
        });
    });

    viewModel.ModifyTravelDetails = (async (travelObj) =>{
        return new Promise((resolve, reject) =>{
            StoredProcedure.execute("modifyTravelDetails.sql", travelObj).then(() =>{
                resolve({ Status: 1, Message: "Travel details successfully modified." });
            }).catch((err) =>{
                resolve({ Status: 2, Message: err });
            });
        });
    });

    return viewModel; 
}

module.exports = TravelListModel;