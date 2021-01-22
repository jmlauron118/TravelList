exports.onFrameLoaded = ((args) =>{
    const page = args.object;

    //check if first run
    var response = 1;

    if(!response){
        //first run page
    }
    else{
        page.defaultPage = "view/dashboard/dashboard";
    }
});