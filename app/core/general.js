const Utils = require("tns-core-modules/utils/utils").ad;
const keyboard = Utils.getInputMethodManager();
const fs = require("file-system");
const ImageSourceModule = require("image-source");


exports.ShowSoftInput = function (element) {
    setTimeout(() => {
        element.android.requestFocus();
        keyboard.showSoftInput(element.android, 0);
    }, 300);
}

exports.SaveImage = (async (selection, filename) =>{
    return new Promise((resolve, reject) =>{
        const source = new ImageSourceModule.ImageSource();

        selection.forEach((selected) =>{
            let appPath = fs.knownFolders.documents();
            var path = fs.path.join(appPath.path, "place-" + filename + ".png");
            
            source.fromAsset(selected).then((res) =>{  
                let saved = res.saveToFile(path, "png");

                if(saved){
                    resolve(path);
                }
                else{
                    reject("Error occure while saving the image.");
                }
            });
        }); 
    });
});

exports.RemoveImgFile = ((url) =>{
    try{
        let appPath = fs.knownFolders.documents();
        let splitUrl = url.split("/");
        let imgFile = splitUrl[splitUrl.length -1];
        let file = appPath.getFile(imgFile);

        if(imgFile != "no-image.png"){
            file.remove().then((res) =>{
                console.log("Image removed!");
            });
        }
    }
    catch(err){
        console.log(`RemoveImgFile error: ${err}`);
    }
});

exports.hasNull = function (obj) {
    for (let member in obj) {
        if (obj[member] === "" || obj[member] === undefined || obj[member] === null) {
            return true;
        }
    }

    return false;
}

exports.SetTransparentPageBg = (() =>{
    page._dialogFragment.getDialog().getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
});