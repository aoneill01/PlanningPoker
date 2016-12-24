using Microsoft.AspNet.SignalR;

namespace PlanningPoker.Hubs
{
    public class PokerHub : Hub
    {
        public void CreateRoom()
        {
            Groups.Add(Context.ConnectionId, PresenterGroup(Clients.Caller.room));
            string group = PlayerGroup(Clients.Caller.room);
            Clients.Group(group).marco();
        }
        
        public void Pick(string card)
        {
            Groups.Add(Context.ConnectionId, PlayerGroup(Clients.Caller.room));
            string group = PresenterGroup(Clients.Caller.room);
            Clients.Group(group).picked(Clients.Caller.name, Context.ConnectionId, card);
        }

        private static string PresenterGroup(string room) => $"presenter-{room}";
        private static string PlayerGroup(string room) => $"player-{room}";
    }
}