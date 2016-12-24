$(function () {
    var pokerHubProxy = $.connection.pokerHub;
    pokerHubProxy.state.room = window.room;

    ko.applyBindings(new RoomViewModel(pokerHubProxy));

    $.connection.hub.start().done(function () {
        pokerHubProxy.server.createRoom();
    });

    function RoomViewModel(pokerHubProxy) {
        var self = this;

        self.players = ko.observableArray([]);

        self.reset = function () {
            $('.hand').removeClass('flip').removeClass('pick');
            for (var i = 0; i < self.players().length; i++) {
                self.players()[i].card("");
            }
        }

        self.findByConnectionId = function (connectionId) {
            for (var i = 0; i < self.players().length; i++) {
                if (self.players()[i].connectionId == connectionId) {
                    return self.players()[i];
                }
            }
            return undefined;
        }

        self.haveAllPicked = function () {
            for (var i = 0; i < self.players().length; i++) {
                if (!self.players()[i].picked()) {
                    return false;
                }
            }
            return true;
        };

        self.flip = ko.observable(false);

        self.nextHand = function () {
            for (var i = 0; i < self.players().length; i++) {
                self.players()[i].stale = true;
            }

            pokerHubProxy.server.nextHand();

            setTimeout(function () {
                self.players.remove(function (player) { return player.stale; });
            }, 2000);
        }

        pokerHubProxy.client.picked = function (name, connectionId, card) {
            var player = self.findByConnectionId(connectionId)

            if (!player) {
                player = new Player(name, connectionId);
                self.players.push(player);
            }

            player.card(card);

            if (self.haveAllPicked()) {
                setTimeout(function () { if (self.haveAllPicked()) self.flip(true); }, 2000);
            }
            else {
                self.flip(false);
            }
        };
    }

    function Player(name, connectionId) {
        var self = this;

        self.name = name;
        self.connectionId = connectionId;
        self.card = ko.observable("");
        self.formattedCard = ko.pureComputed(function () {
            if (self.card() == "c") return '<span class="glyphicon glyphicon-glass" aria-hidden="true"></span>';
            return self.card();
        }, self);

        self.picked = ko.pureComputed(function () {
            return self.card() != "";
        }, self);

        self.stale = false;

        self.card.subscribe(function () { self.stale = false; });
    }
});

$(function () {
    for (var i = 0; i < 5; i++) {
        setTimeout(foo(i + 1), i * 200);
    }
});

function foo(nth) {
    return function () {
        think(nth);
        setInterval(think(nth), 2000);
    }
}

function think(nth) {
    return function () {
        $('.hand .card:nth-child(' + nth + ')').addClass('think');
        setTimeout(function () {
            $('.hand .card:nth-child(' + nth + ')').removeClass('think');
        }, 500);
    };
}