const TravelListModel = require("./travel-list-model");
const ImagePicker = require("@nativescript/imagepicker");
const ShowMessage = require("~/core/validation").ShowMessage;
const General = require("~/core/general");
const Dialog = require("tns-core-modules/ui/dialogs");
const Moment = require("~/core/moment");
const Loading = require("~/view/shared/loading/loading");


exports.onNavigatedTo = ((args) =>{
    const page = args.object;
    const context = args.context;

    page.bindingContext = new TravelListModel();
    page.bindingContext.set("isUpdate", context.ind);
    page.bindingContext.set("processing", true);

    if(context.ind == "update"){
        page.bindingContext.set("currData", context.currData);
        page.getViewById("txtPlace").text = context.currData.PLACE;
        page.getViewById("txtDesc").text = context.currData.DESCRIPTION;
        page.getViewById("placeImg").src = context.currData.PLACE_IMG || "~/content/images/no-image.png";
        page.getViewById("txtDate").text = context.currData.DATE;

        if(!page.getViewById("placeImg").src.includes("no-image.png")){
            global.hasImage = 1;
            page.bindingContext.ImageToggle();
        }
    }

    setTimeout(() => {
        page.bindingContext.set("processing", false);
    }, 500);
});

exports.onOutsideTouch = ((args) =>{
    const page = args.object.page;

    page.getViewById("txtPlace").android.clearFocus();
    page.getViewById("txtDesc").android.clearFocus();
});

exports.onChoosePhoto = ((args) =>{
    var img = args.object;
    var page = img.page;
    let imgContext = ImagePicker.create({
        mode: "single"
    });
     
    imgContext.authorize().then(() =>{
        return imgContext.present();
    }).then((selection) =>{
        global.imgAsset = selection;

        img.src = selection[0].android;
        global.hasImage = 1;
        page.bindingContext.ImageToggle();
    }).catch((e)=>{
        ShowMessage("Warning!", e, "warning");
    });
});

exports.onSaveDetails = (async (args) =>{
    const btnSave = args.object;
    const page = btnSave.page;
    let txtPlace = page.getViewById("txtPlace");
    let txtDesc = page.getViewById("txtDesc");
    let txtDate = page.getViewById("txtDate");
    var travelObj = [
        txtPlace.text,
        txtDesc.text,
        Moment(txtDate.text, "MMM DD, YYYY").format("YYYY-MM-DD")
    ];

    if(General.hasNull(travelObj)){
        ShowMessage("Warning!", "Please fill all the fields.", "warning");
    }
    else{
        page.bindingContext.set("processing", true);

        if(!global.hasImage){
            Dialog.confirm({
                title: "Travel List",
                message: "Do you want to save without an image selected?",
                cancelButtonText: "No",
                okButtonText: "Yes"
            }).then((result) =>{
                if(result){
                    if(page.bindingContext.get("isUpdate") == "update"){
                        var img = page.bindingContext.get("currData").PLACE_IMG;

                        if(!img.includes("no-image.png")){
                            General.RemoveImgFile(page.bindingContext.get("currData").PLACE_IMG);
                            img = null;
                        }

                        travelObj[travelObj.length] = img;
                        travelObj[travelObj.length] = page.bindingContext.get("currData").TRAVEL_ID;
                        
                        page.bindingContext.ModifyTravelDetails(travelObj).then((response) =>{
                            ShowMessage("Success!", response.Message, "success");
                            this.ClearFields(page);
                            page.bindingContext.set("processing", false);
                            page.frame.goBack();
                        });
                    }
                    else{
                        page.bindingContext.SaveTravelDetails(travelObj).then((response) =>{
                            ShowMessage("Success!", response.Message, "success");
                            this.ClearFields(page);
                            page.bindingContext.set("processing", false);
                        });
                    }
                }
            });
        }   
        else{
            var date = Moment(txtDate.text, "MMM DD, YYYY").format("YYYY-MM-DD");

            if(page.bindingContext.get("isUpdate") == "update"){
                var img = page.bindingContext.get("currData").PLACE_IMG;
                var placeImg = page.getViewById("placeImg").src;

                if(img != placeImg && placeImg.includes("no-image.png")){
                    General.RemoveImgFile(img);

                    travelObj[travelObj.length] = placeImg;
                    travelObj[travelObj.length] = page.bindingContext.get("currData").TRAVEL_ID;
        
                    page.bindingContext.ModifyTravelDetails(travelObj).then((response) =>{
                        ShowMessage("Success!", response.Message, "success");
                        this.ClearFields(page);
                        page.bindingContext.set("processing", false);
                        page.frame.goBack();  
                    });
                }
                else if(img == placeImg){
                    travelObj[travelObj.length] = img;
                    travelObj[travelObj.length] = page.bindingContext.get("currData").TRAVEL_ID;
        
                    page.bindingContext.ModifyTravelDetails(travelObj).then((response) =>{
                        ShowMessage("Success!", response.Message, "success");
                        this.ClearFields(page);
                        page.bindingContext.set("processing", false);
                        page.frame.goBack();  
                    });
                }
                else{
                    General.SaveImage(global.imgAsset, txtPlace.text+"-"+date).then((response) =>{
                        travelObj[travelObj.length] = response;
                        travelObj[travelObj.length] = page.bindingContext.get("currData").TRAVEL_ID;
        
                        page.bindingContext.ModifyTravelDetails(travelObj).then((response) =>{
                            ShowMessage("Success!", response.Message, "success");
                            this.ClearFields(page);
                            page.bindingContext.set("processing", false);
                            page.frame.goBack();
                        });
                    }).catch((err) =>{
                        ShowMessage("Warning!", err, "warning");
                        page.bindingContext.set("processing", false);
                    });
                }
            }
            else{
                General.SaveImage(global.imgAsset, txtPlace.text+"-"+date).then((response) =>{
                    travelObj[travelObj.length] = response;

                    page.bindingContext.SaveTravelDetails(travelObj).then((response) =>{
                        if(response.Status == 1){
                            ShowMessage("Success!", response.message, "success");
                            this.ClearFields(page);
                            page.bindingContext.set("processing", false);
                        }
                        else{
                            ShowMessage("Error", response.message, "error");
                            page.bindingContext.set("processing", false);
                        }
                    });
                }).catch((err) =>{
                    ShowMessage("Warning!", err, "warning");
                    page.bindingContext.set("processing", false);
                });
            }
        }
    }
});

exports.onRemoveImage = ((args) =>{
    const page = args.object.page;
    var placeImg = page.getViewById("placeImg");

    global.hasImage = 0;
    page.bindingContext.ImageToggle();
    placeImg.src = "~/content/images/no-image.png";
});

exports.ClearFields = ((page) =>{
    let txtPlace = page.getViewById("txtPlace");
    let txtDesc = page.getViewById("txtDesc");
    let txtDate = page.getViewById("txtDate");
    let btnRemoveImage = page.getViewById("btnRemoveImage");

    txtPlace.text = "";
    txtDesc.text = "";
    txtDate.text = "";
    btnRemoveImage.notify({eventName: "tap", object: btnRemoveImage});
});

