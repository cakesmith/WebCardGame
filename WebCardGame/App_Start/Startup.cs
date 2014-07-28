using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WebCardGame.Startup))]
namespace WebCardGame
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}