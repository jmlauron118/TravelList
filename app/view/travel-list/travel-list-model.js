const Observable = require("tns-core-modules/data/observable").Observable;
const StoredProcedure = require("~/core/storedprocedure");
const Loading = require("~/view/shared/loading/loading");

function TravelListModel(){
    const viewModel = new Observable();

    viewModel.set("hasImage", global.hasImage);

    viewModel.ImageToggle = function() {
        viewModel.set("hasImage", global.hasImage);
    } 

    viewModel.SaveTravelDetails = (async (travelObj) =>{
        return new Promise((resolve, reject) =>{
            setTimeout(() => {
                StoredProcedure.execute("addTravelDetails.sql", travelObj).then((response) =>{
                    global.imgAsset = "";
                    resolve({ Status: 1, Message: "Travel details successfully saved."});
                }).catch((err) => {
                    resolve({ Status: 2, Message: `An unexpected error encountered while processing your request. (${err})` });
                });
            }, 1500);
        });
    });

    viewModel.ModifyTravelDetails = (async (travelObj) =>{
        return new Promise((resolve, reject) =>{
            setTimeout(() => {
                StoredProcedure.execute("modifyTravelDetails.sql", travelObj).then(() =>{
                    resolve({ Status: 1, Message: "Travel details successfully modified." });
                }).catch((err) =>{
                    resolve({ Status: 2, Message: err });
                });
            }, 1500);
        });
    });

    return viewModel; 
}

module.exports = TravelListModel;