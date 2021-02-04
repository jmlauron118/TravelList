const Obserbable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const StoredProcedure = require("~/core/storedprocedure");
const Moment = require("~/core/moment");
const General = require("~/core/general");
const Loading = require("~/view/shared/loading/loading");

function DashboardModel(){
    let viewModel = new Obserbable();

    viewModel.travelList = new ObservableArray();

    global.hasImage = 0;
    global.imgAsset = "";

    viewModel.GetTravelDetails = (() =>{
        return new Promise((resolve, reject) =>{
            var itemList = [];

            StoredProcedure.getData("getTravelDetails.sql").then((response) =>{
                if(response.length > 0){
                    var defaultImg = "~/content/images/no-image.png";
                    viewModel.set("noData", 0);
                    viewModel.set("hasData", 1); 

                    for(let row in response){
                        itemList[row] = {
                            TRAVEL_ID: response[row][0],
                            PLACE: response[row][1],
                            DESCRIPTION: response[row][2],
                            PLACE_IMG: response[row][3] == null ? defaultImg : response[row][3],
                            DATE: Moment(response[row][4], "YYYY-MM-DD").format("MMM DD, YYYY")
                        };
                    }
        
                    viewModel.set("travelList", itemList);
                    resolve();
                }
                else{
                    viewModel.set("noData", 1);
                    viewModel.set("hasData", 0);
                    resolve();
                }
            }); 
        });
    });

    viewModel.RemoveTravelDetails = (async (travelIds, imgList) =>{
        return new Promise((resolve, reject) =>{
            var deleteCount = 0;

            for(let id in travelIds){
                StoredProcedure.execute("removeTravelDetailsById.sql", travelIds[id]).then(() =>{
                    deleteCount = deleteCount + 1;
                    General.RemoveImgFile(imgList[id]);

                    if(id == travelIds.length-1){
                        if(travelIds.length > deleteCount){
                            resolve({ Status: 0, Message: "Problem occurs while deleting the data."});
                        }
                        else{
                            resolve({ Status: 1, Message: "Successfully removed travel details."});
                        }
                    }
                }).catch((err) =>{
                    resolve({ Status: 2, Message: err});
                });
            }
        });
    });
    
    return viewModel;
}

module.exports = DashboardModel;