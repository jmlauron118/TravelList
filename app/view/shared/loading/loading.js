exports.onShownModal = ((args) => {
    const page = args.object;
    
    global.LoadingPage = page;   
});

exports.onCloseModal = ((page) => {
    try {
        page.closeModal();
    } catch (err) {
        console.log('onCloseModal', err);
    }
}) 