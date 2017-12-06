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

        self.findByName = function (name) {
            for (var i = 0; i < self.players().length; i++) {
                if (self.players()[i].name == name) {
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

            self.start = new Date().getTime();

            setTimeout(function () {
                self.players.remove(function (player) { return player.stale; });
            }, 2000);
        }

        self.timer = ko.observable("");

        pokerHubProxy.client.picked = function (name, card) {
            var player = self.findByName(name)

            if (!player) {
                player = new Player(name);
                self.players.push(player);
                self.players.sort(function (left, right) { return left.name.toLowerCase() == right.name.toLowerCase() ? 0 : (left.name.toLowerCase() < right.name.toLowerCase() ? -1 : 1) })
            }

            player.card(card);

            if (self.haveAllPicked()) {
                setTimeout(function () { if (self.haveAllPicked()) self.flip(true); }, 2000);
            }
            else {
                self.flip(false);
            }
        };

        self.start = new Date().getTime();

        setInterval(function () {
            var totalSeconds = (new Date().getTime() - self.start) / 1000;

            var minutes = Math.floor(totalSeconds / 60);
            var seconds = Math.floor(totalSeconds % 60);

            self.timer(minutes + ":" + (seconds < 10 ? '0' + seconds : seconds));

            // Bad - Should find a more appropriate way to do this with Knockout, but I'm lazy.
            document.title = "Planning Poker (" + self.timer() + ")";
        }, 1000);
    }

    function Player(name) {
        var self = this;

        self.name = name;
        self.card = ko.observable("");
        self.formattedCard = ko.pureComputed(function () {
            if (self.card().indexOf('fa-') == 0) return '<i class="fa ' + self.card() + '" aria-hidden="true"></i>';
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

