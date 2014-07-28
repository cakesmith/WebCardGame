namespace WebCardGame.Models
{
    public class Player
    {
        public string Id { get; private set; }
        public string Name { get; private set; }
        public int Points { get; set; }
        public string ActiveGameId { get; set; }
        public Player(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
    }
}