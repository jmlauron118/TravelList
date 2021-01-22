const TravelListModel = require("./travel-list-model");
const ImagePicker = require("@nativescript/imagepicker");
const fs = require("file-system");
const ShowMessage = require("~/core/validation").ShowMessage;
const ImageSourceModule = require("image-source");


exports.onLoaded = ((args) =>{
    const page = args.object;

    page.bindingContext = new TravelListModel();
});

exports.onChoosePhoto = ((args) =>{
    var img = args.object;
    var page = img.page;
    let imgContext = ImagePicker.create({
        mode: "single"
    });

    const source = new ImageSourceModule.ImageSource();
    
    imgContext.authorize().then(() =>{
        return imgContext.present();
    }).then((selection) =>{
        selection.forEach((selected) =>{
            const imageAsset = selected.android;
            
            let appPath = fs.knownFolders.documents();
            var path = fs.path.join(appPath.path, "place-1.png");
            
            source.fromAsset(selected).then((res) =>{  
                let saved = res.saveToFile(path, "png");

                if(saved){
                    img.src = path;
                    page.bindingContext.testImg = path;
                }
            });
        }); 
    }).catch((e)=>{
        ShowMessage("Warning!", e, "warning");
    });
});

exports.onSaveDetails = ((args) =>{
    var btnSave = args.object;
    const page = btnSave.page;

    var wew = page.getViewById("wew");
    var wew1 = page.getViewById("wew1");

    wew1.src = wew.src;
});