const Obserbable = require("tns-core-modules/data/observable").Observable;
const StoredProcedure = require("~/core/storedprocedure");

function DashboardModel(){
    let viewModel = new Obserbable();
    
    global.hasImage = 0;
    global.imgAsset = "";

    viewModel.GetTravelDetails = (() =>{
        StoredProcedure.getData("getTravelDetails.sql").then((response) =>{
            console.log(response);
        });
    });
    
    return viewModel;
}

module.exports = DashboardModel;