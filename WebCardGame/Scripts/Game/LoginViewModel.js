function LoginViewModel(hub) {
    this.hub = hub;
    this.playerName = ko.observable("");
    this.gameId = ko.observable("foo");
    this.join = function () {
        if (hub.server.registerPlayer(this.playerName())) {
            hub.server.createOrJoinGame(this.gameId());
        }

        this.joined(true);
    };
    this.joined = ko.observable(false);
}