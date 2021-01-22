const DashboardModel = require("./dashboard-model");
const FrameModule = require("tns-core-modules/ui/frame").Frame;

exports.onLoaded = ((args) =>{
    const page = args.object;

    page.bindingContext = new DashboardModel();
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
        }
    });
});