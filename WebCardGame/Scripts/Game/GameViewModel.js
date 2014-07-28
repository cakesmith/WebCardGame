function GameViewModel(hub) {
    var parent = this;
    this.gameId = null;
    this.hub = hub;
    this.blackCard = ko.observable({cardId: "x", cardText: "foo"});
    this.playedCards = ko.observableArray([
        { cardId: "x", cardText: "foo" },
        { cardId: "y", cardText: "bar" },
        { cardId: "z", cardText: "baz" }
    ]);
    this.playerCards = ko.observableArray([
        { cardId: "xx", cardText: "foofoo" },
        { cardId: "yy", cardText: "barbar" },
        { cardId: "zz", cardText: "bazbaz" }
    ]);

    this.stagedCards = ko.observableArray();

    this.playersInGame = ko.observableArray();
    this.chatLog = ko.observableArray();

    this.typedChatText = ko.observable();
    
    this.sendTypedChatText = function () {
        hub.server.sendChatMessage(parent.gameId, parent.typedChatText());
        parent.typedChatText('');
    };

    this.fixScrolling = function () {
        var chat = $('#chat');
        chat.scrollTop(chat[0].scrollHeight);
    };

    hub.client.playedCard = function (cardId) {
        parent.playedCards.push({ cardId: cardId, cardText:'' });
    };

    hub.client.unplayedCard = function (cardId) {
        parent.playedCards.remove(function (item) {
            return item.cardId === cardId;
        });
    };
    
    this.reapplyDraggableToStaging = function(elements) {
        $(elements).draggable({ helper: 'clone', connectToSortable: "#activeCards" });
        $('#activeCards').droppable({accept: ".smallCard", 
            drop: function (event, ui) {
                var id = ui.draggable.prop('id');
                var removedItem = parent.playerCards.remove(function (item) {
                    return item.cardId === id;
                });
                parent.stagedCards.push(removedItem[0]);
                hub.server.playedCard(parent.gameId, ui.draggable.prop('id'));
            }
        });

    };
    
    this.reapplyDraggableToHand = function (elements) {
        $(elements).draggable({ helper: 'clone', connectToSortable: "#playerHand" });
        $('#playerHand').droppable({accept: ".bigCard",
            drop: function (event, ui) {
                var id = ui.draggable.prop('id');
                var removedItem = parent.stagedCards.remove(function (item) {
                    return item.cardId === id;
                });
                parent.playerCards.push(removedItem[0]);
                hub.server.unplayedCard(parent.gameId, ui.draggable.prop('id'));
            }
        });
    };

    hub.client.playerJoined = function (player) {
        parent.playersInGame.push(player);
    };

    hub.client.sendInitialGameState = function (game) {
        parent.gameId = game.Id;
        game.Players.forEach(function (p) {
            parent.playersInGame.push(p);
        });
    };
    
    hub.client.playerQuit = function (player) {
        parent.playersInGame.remove(function (item) {
            return item.Id === player.Id;
        });
    };

    hub.client.sendChatMessage = function(player, message) {
        parent.chatLog.push({ Player: player, Message: message });
    };

}