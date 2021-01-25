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

                resolve(resolve);
            }).catch((err) => {
                console.log(err);
                ShowMessage("Error", "An unexpected error encountered while processing your request.", "error");
            });
        });
    });

    return viewModel; 
}

module.exports = TravelListModel;