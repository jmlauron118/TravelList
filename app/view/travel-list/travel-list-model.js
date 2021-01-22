const Observable = require("tns-core-modules/data/observable").Observable;

function TravelListModel(){
    const viewModel = new Observable();
    viewModel.testImg = "";


    return viewModel;
}

module.exports = TravelListModel;