const TravelListModel = require("./travel-list-model");
const ImagePicker = require("@nativescript/imagepicker");
const ShowMessage = require("~/core/validation").ShowMessage;
const General = require("~/core/general");
const Dialog = require("tns-core-modules/ui/dialogs");
const Moment = require("~/core/moment");


exports.onLoaded = ((args) =>{
    const page = args.object;

    page.bindingContext = new TravelListModel();
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

exports.onSaveDetails = ((args) =>{
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
        if(!global.hasImage){
            Dialog.confirm({
                title: "Travel List",
                message: "Do you want to save without an image selected?",
                cancelButtonText: "No",
                okButtonText: "Yes"
            }).then((result) =>{
                if(result){
                    page.bindingContext.SaveTravelDetails(travelObj).then(() =>{
                        ShowMessage("Success!", "Travel details successfully saved.", "success");
                        this.ClearFields(page);
                    });
                }
            });
        }   
        else{
            var date = Moment(txtDate.text, "MMM DD, YYYY").format("YYYY-MM-DD");

            General.SaveImage(global.imgAsset, txtPlace.text+"-"+date).then((response) =>{
                travelObj[travelObj.length] = response;

                page.bindingContext.SaveTravelDetails(travelObj).then(() =>{
                    ShowMessage("Success!", "Travel details successfully saved.", "success");
                    this.ClearFields(page);
                });
            }).catch((err) =>{
                ShowMessage("Warning!", err, "warning");
            });
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

