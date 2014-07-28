function HomeViewModel(loginViewModel, gameViewModel) {
    var loginVm = loginViewModel;
    var gameVm = gameViewModel;
    
    this.displayLogin = ko.computed(function () {
        return !loginVm.joined();
    });
    
    this.displayLobby = ko.computed(function () {
        return false; // lobby is inactive, don't display it ever right now
    });
    
    this.displayGame = ko.computed(function () {
        return loginVm.joined();
    });
}


ko.bindingHandlers.executeOnEnter = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                allBindings.executeOnEnter.call(viewModel);
                return false;
            }
            return true;
        });
    }
};

$.connection.hub.start();
var hub = $.connection.gameHub;
var gameVm = new GameViewModel(hub);
var loginVm = new LoginViewModel(hub);
var homeVm = new HomeViewModel(loginVm, gameVm);
ko.applyBindings({homeVm: homeVm, loginVm: loginVm, gameVm: gameVm});
