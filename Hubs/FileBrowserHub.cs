using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebFTPSharp.Hubs
{
	public class FileBrowserHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
