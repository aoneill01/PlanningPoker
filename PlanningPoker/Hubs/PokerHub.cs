﻿using Microsoft.AspNet.SignalR;

namespace PlanningPoker.Hubs
{
    public class PokerHub : Hub
    {
        public void CreateRoom()
        {
            Groups.Add(Context.ConnectionId, PresenterGroup(Clients.Caller.room));
        }

        public void Join()
        {
            Groups.Add(Context.ConnectionId, PlayerGroup(Clients.Caller.room));
            string group = PresenterGroup(Clients.Caller.room);
            Clients.Group(group).playerJoined(Clients.Caller.name, Context.ConnectionId);
        }

        public void Pick(string card)
        {
            string group = PresenterGroup(Clients.Caller.room);
            Clients.Group(group).picked(Clients.Caller.name, Context.ConnectionId, card);
        }

        private static string PresenterGroup(string room) => $"presenter-{room}";
        private static string PlayerGroup(string room) => $"player-{room}";
    }
}