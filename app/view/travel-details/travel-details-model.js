const Obserbable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const StoredProcedure = require("~/core/storedprocedure");
const { ShowMessage } = require("~/core/validation");
const Moment = require("~/core/moment");
const General = require("~/core/general");

function TravelDetailsModel(){
    const viewModel = new Obserbable();
    var details = [];

    viewModel.GetTravelDetailsById = ((travelId) =>{
        StoredProcedure.getData("getTravelDetailsById.sql", travelId).then((response) =>{
            if(response.length > 0){
                var defaultImg = "~/content/images/no-image.png";
             
                for(let row in response){
                    details[row] = {
                        TRAVEL_ID: response[row][0],
                        PLACE: response[row][1],
                        DESCRIPTION: response[row][2],
                        PLACE_IMG: response[row][3] == null ? defaultImg : response[row][3],
                        DATE: Moment(response[row][4], "YYYY-MM-DD").format("MMM DD, YYYY")
                    };
                }

                viewModel.set("travelDetails", details);
            }
            else{
                ShowMessage("Warning!", "Data is not found", "warning");
            }
        }).
        catch((err)=>{
            ShowMessage("Warning!", err, "warning");
        });
    });

    viewModel.RemoveTravelDetails = (async (travelId, imgUrl) =>{
        return new Promise((resolve, reject) =>{
            StoredProcedure.execute("removeTravelDetailsById.sql", travelId).then(() =>{
                General.RemoveImgFile(imgUrl);
                resolve({ Status: 1, Message: "Successfully removed travel details."});
            }).catch((err) =>{
                resolve({ Status: 2, Message: err});
            });
        });
    });

    return viewModel;
}

module.exports = TravelDetailsModel;