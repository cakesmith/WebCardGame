using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using WebCardGame.Models;

namespace WebCardGame.Hubs
{
    public class GameHub : Hub
    {
        private static readonly ConcurrentDictionary<string, Player> ActiveUsers = new ConcurrentDictionary<string, Player>();
        private static readonly ConcurrentDictionary<string, Game> ActiveGames = new ConcurrentDictionary<string, Game>();

        public bool AlreadyPlaying(string userId)
        {
            return true;
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            Player player;
            ActiveUsers.TryRemove(Context.ConnectionId, out player);
            var games = ActiveGames[player.ActiveGameId];
            Clients.OthersInGroup(player.ActiveGameId).PlayerQuit(player);

            games.Leave(player);
            return base.OnDisconnected(stopCalled);
        }

        public bool RegisterPlayer(string userName)
        {
            if (!ActiveUsers.ContainsKey(Context.ConnectionId))
            {
                var player = new Player(Context.ConnectionId, userName);
                ActiveUsers.TryAdd(Context.ConnectionId, player);
                return true;
            }
            return false;
        }

        public async Task CreateOrJoinGame(string gameId)
        {
            if (!ActiveGames.ContainsKey(gameId))
            {
                ActiveGames.TryAdd(gameId, new Game(gameId, "Test Game"));
            }

            var game = ActiveGames[gameId];
            var player = ActiveUsers[Context.ConnectionId];
            player.ActiveGameId = gameId;
            game.Join(player);
            await Clients.Caller.sendInitialGameState(game);
            await Groups.Add(Context.ConnectionId, gameId);
            await Clients.OthersInGroup(gameId).playerJoined(ActiveUsers[Context.ConnectionId]);
        }

        public async Task PlayedCard(string gameId, string cardId)
        {
            await Clients.OthersInGroup(gameId).playedCard(cardId + Context.ConnectionId);
        }

        public async Task UnplayedCard(string gameId, string cardId)
        {
            await Clients.OthersInGroup(gameId).unplayedCard(cardId + Context.ConnectionId);
        }

        public async Task SendChatMessage(string gameId, string message)
        {
            await Clients.Group(gameId).sendChatMessage(ActiveUsers[Context.ConnectionId], message);
        }
    }
}