using System.Collections.Generic;
using System.Collections.ObjectModel;

using WebCardGame.Hubs;

namespace WebCardGame.Models
{
    public class Game
    {
        public string Id { get; private set; }
        public string Name { get; private set; }
        public IReadOnlyCollection<Player> Players { get; private set; }

        private readonly List<Player> players = new List<Player>();

        public Game(string id, string name)
        {
            this.Id = id;
            this.Name = name;
            this.Players = new ReadOnlyCollection<Player>(this.players);
        }

        public void Join(Player newPlayer)
        {
            this.players.Add(newPlayer);
        }

        public void Leave(Player player)
        {
            this.players.Remove(player);
        }
    }
}