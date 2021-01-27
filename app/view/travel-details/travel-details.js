const TravelDetailsModel = require("./travel-details-model");
const { ShowMessage } = require("~/core/validation");
const Dialog = require("tns-core-modules/ui/dialogs");

exports.onNavigatedTo = ((args) =>{
    const page = args.object;
    let travelId = args.context.travelId;

    page.bindingContext = new TravelDetailsModel();
    page.bindingContext.GetTravelDetailsById(travelId);
});

exports.onRemoveTravelDetails = ((args) =>{
    Dialog.confirm({
        title: "Travel List",
        message: "Do you remove selected travel details?",
        cancelButtonText: "No",
        okButtonText: "Yes"
    }).then((result) =>{
        if(result){
            const elem = args.object;
            const page = elem.page;
            let travelId = page.bindingContext.get("travelDetails")[0].TRAVEL_ID;
            let imgUrl = page.bindingContext.get("travelDetails")[0].PLACE_IMG;

            page.bindingContext.RemoveTravelDetails(travelId, imgUrl).then((response) =>{
                if(response.Status === 1){
                    ShowMessage("Success!", response.Message, "success");

                    page.frame.navigate({
                        moduleName: "view/dashboard/dashboard",
                        animated: true,
                        transition: {
                            name: "slide",
                            duration: 250,
                            curve: "easeInOut"
                        }
                    });
                }
                else{
                    ShowMessage("Warning!", response.Message, "warning");
                }
            });
        }
    });
});

exports.onUpdateTravelDetails = ((args) =>{
    const elem = args.object;
    const page = elem.page;
    var currData = page.bindingContext.get("travelDetails")[0];

    page.frame.navigate({
        moduleName: "view/travel-list/travel-list",
        animated: true,
        transition: {
            name: "slide",
            duration: 250,
            curve: "easeInOut"
        },
        context: {
            currData: currData,
            ind: "update"
        }
    });
});