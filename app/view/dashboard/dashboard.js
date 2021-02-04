const { ShowMessage } = require("~/core/validation");
const DashboardModel = require("./dashboard-model");
const Dialog = require("tns-core-modules/ui/dialogs");
require("nativescript-dom");

exports.onLoaded = ((args) =>{
    const page = args.object; 

    page.bindingContext = new DashboardModel();
    page.bindingContext.set("processing", true);
    setTimeout(() =>{
        page.bindingContext.GetTravelDetails().then(() =>{
            page.bindingContext.set("processing", false);
        });
    },1500);
});

exports.AddTravelDetails = ((args) =>{
    const page = args.object.page;
  
    page.frame.navigate({
        moduleName: "view/travel-list/travel-list",
        animated: true,
        transition: {
            name: "fade",
            duration: 250,
            curve: "easeInOut"
        },
        context: {
            ind: "add"
        }
    });
});

exports.onTravelItemTap =((args) =>{
    const elem = args.object;
    const page = elem.page;

    if(page.bindingContext.get("isLongPressed")){
       this.PressToggle(elem);
    }
    else{
        page.frame.navigate({
            moduleName: "view/travel-details/travel-details",
            animated: true,
            transition:{
                name: "fade",
                duration: 250,
                curve: "easeInOut"
            }, 
            context: {
                travelId: elem.travelHeadId
            }
        });
    }
});

exports.onTravelItemLongPress = ((args) =>{
    const elem = args.object;
    const page = elem.page;

    page.bindingContext.set("isLongPressed", 1);
    elem.getElementsByClassName("ind")[0].visibility = "visible";
    elem.getElementsByClassName("ind")[0].classList.add("selected");
});

exports.PressToggle = ((elem) =>{
    const page = elem.page; 

    if(elem.getElementsByClassName("ind")[0].visibility == "visible"){
        elem.getElementsByClassName("ind")[0].visibility = "collapsed";
        elem.getElementsByClassName("ind")[0].classList.remove("selected");

        if(page.getElementsByClassName("selected").length > 0){
            page.bindingContext.set("isLongPressed", 1);
            page.bindingContext.set("hasSelected", 1);
        }
        else{
            page.bindingContext.set("isLongPressed", 0);
            page.bindingContext.set("hasSelected", 0);
        }
    }  
    else{
        page.bindingContext.set("isLongPressed", 1);
        elem.getElementsByClassName("ind")[0].visibility = "visible";
        elem.getElementsByClassName("ind")[0].classList.add("selected");
    }
});

exports.onCancelSelected = ((args) =>{
    const page = args.object.page; 
    let selectedItems = page.getElementsByClassName("ind");

    for(let item in selectedItems){
        selectedItems[item].visibility = "collapsed";
        selectedItems[item].classList.remove("selected");
    }

    page.bindingContext.set("isLongPressed", 0);
});

exports.onRemoveTravelDetails = ((args) =>{
    Dialog.confirm({
        title: "Travel List",
        message: "Do you remove selected travel details?",
        cancelButtonText: "No",
        okButtonText: "Yes"
    }).then((result) =>{
        if(result){
            const page = args.object.page;
            let selectedItems = page.getElementsByClassName("selected");
            let travelIds = [];
            let imgList = [];

            for(let item in selectedItems){
                travelIds.push(selectedItems[item].travelId);
                imgList.push(selectedItems[item].parent.getElementsByTagName("Image")[0].src);
            }

            page.bindingContext.RemoveTravelDetails(travelIds, imgList).then((response) =>{
                if(response.Status === 1){
                    ShowMessage("Success!", response.Message, "success");
                    page.bindingContext.GetTravelDetails();
                }
                else{
                    ShowMessage("Warning!", response.Message, "warning");
                }

                page.bindingContext.set("isLongPressed", 0);
            });
        }
    });
});