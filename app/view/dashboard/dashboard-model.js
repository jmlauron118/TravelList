const Obserbable = require("tns-core-modules/data/observable").Observable;

function DashboardModel(){
    let viewModel = new Obserbable();

    return viewModel;
}

module.exports = DashboardModel;