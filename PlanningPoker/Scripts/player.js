$(function () {
    var pokerHubProxy = $.connection.pokerHub;

    ko.applyBindings(new PlayerViewModel(pokerHubProxy));

    function PlayerViewModel() {
        var self = this;

        self.cards = ko.observableArray([new Card("0"), new Card("½"), new Card("1"), new Card("2"), new Card("3"), new Card("5"), new Card("8"), new Card("13"), new Card("21"), new Card("?"), new Card("fa-coffee"), new Card("∞")]);
        if (window.location.hash == "#rps") {
            self.cards = ko.observableArray([new Card("fa-hand-rock-o"), new Card("fa-hand-paper-o"), new Card("fa-hand-scissors-o"), new Card("fa-hand-lizard-o"), new Card("fa-hand-spock-o")]);
        }
        if (window.location.hash == "#sml") {
            self.cards = ko.observableArray([new Card("xs"), new Card("s"), new Card("m"), new Card("l"), new Card("xl")]);
        }
        if (window.location.hash == "#all") {
            self.cards = ko.observableArray([new Card("0"), new Card("½"), new Card("1"), new Card("2"), new Card("3"), new Card("5"), new Card("8"), new Card("13"), new Card("21"), new Card("?"), new Card("fa-coffee"), new Card("∞"), new Card("xs"), new Card("s"), new Card("m"), new Card("l"), new Card("xl"), new Card("fa-hand-rock-o"), new Card("fa-hand-paper-o"), new Card("fa-hand-scissors-o"), new Card("fa-hand-lizard-o"), new Card("fa-hand-spock-o"), new Card("fa-thumbs-o-up"), new Card("fa-thumbs-o-down"), new Card("fa-smile-o"), new Card("fa-frown-o"), new Card("fa-star-o")]);
        }

        self.loggedIn = ko.observable(false);
        self.name = ko.observable();
        self.room = ko.observable(window.lastRoomId);
        
        self.logIn = function () {
            try {
                window.localStorage.setItem('lastUsedName', self.name());
            }
            catch (err) {
                // Do nothing
            }

            pokerHubProxy.state.name = self.name();
            pokerHubProxy.state.room = self.room();

            $.connection.hub.start().done(pokerHubProxy.client.marco);

            $.connection.hub.disconnected(function () {
                $.connection.hub.start().done(pokerHubProxy.client.marco);
            });

            self.loggedIn(true);
        };

        if (window.localStorage && window.localStorage.getItem('lastUsedName')) self.name(window.localStorage.getItem('lastUsedName'));

        self.isFormValid = ko.computed(function () {
            return self.name() && self.room();
        });

        self.pickedCard = ko.observable(null);
        self.pickCard = function (card) {
            if (self.pickedCard()) {
                if (self.pickedCard() == card) {
                    self.pickedCard().picked(false);
                    self.pickedCard(null);
                    pokerHubProxy.server.pick("");
                }
                else {
                    self.pickedCard().picked(false);
                    self.pickedCard(card);
                    self.pickedCard().picked(true);
                    pokerHubProxy.server.pick(self.pickedCard().value);
                }
            }
            else {
                self.pickedCard(card);
                self.pickedCard().picked(true);
                pokerHubProxy.server.pick(self.pickedCard().value);
            }
        };

        pokerHubProxy.client.marco = function () {
            if (self.pickedCard()) {
                pokerHubProxy.server.pick(self.pickedCard().value);
            }
            else {
                pokerHubProxy.server.pick("");
            }
        }

        pokerHubProxy.client.clear = function () {
            if (self.pickedCard()) {
                self.pickedCard().picked(false);
                self.pickedCard(null);
            }
            pokerHubProxy.server.pick("...");
            pokerHubProxy.server.pick("");
        }
    }

    function Card(value) {
        var self = this;
        self.value = value;

        self.picked = ko.observable(false);

        self.formattedValue = ko.pureComputed(function () {
            if (self.value.indexOf('fa-') == 0) return '<i class="fa ' + self.value + '" aria-hidden="true"></i>';
            return self.value;
        }, self);

        self.classes = ko.pureComputed(function () {
            return 'btn btn-lg ' + (self.picked() ? 'btn-success' : 'btn-primary');
        })
    }
});