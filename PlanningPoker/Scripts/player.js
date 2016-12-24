$(function () {
    var pokerHubProxy = $.connection.pokerHub;

    pokerHubProxy.state.name = prompt('Enter your name:', '')
    pokerHubProxy.state.room = prompt('Enter the room id', '');

    ko.applyBindings(new PlayerViewModel(pokerHubProxy));

    $.connection.hub.start().done(function () {
        pokerHubProxy.server.pick("");
    });

    function PlayerViewModel() {
        var self = this;

        self.cards = ko.observableArray([new Card("0"), new Card("½"), new Card("1"), new Card("2"), new Card("3"), new Card("5"), new Card("8"), new Card("13"), new Card("21"), new Card("?"), new Card("c"), new Card("∞")]);
        self.name = ko.observable(pokerHubProxy.state.name);
        self.room = ko.observable(pokerHubProxy.state.room);
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
            if (self.value == "c") return '<span class="glyphicon glyphicon-glass" aria-hidden="true"></span>';
            return self.value;
        }, self);

        self.classes = ko.pureComputed(function () {
            return 'btn btn-lg ' + (self.picked() ? 'btn-success' : 'btn-primary');
        })
    }
});