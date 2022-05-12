using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace WebFTPSharp.Hubs
{
	public class FileBrowserHub : Hub
    {
		/// <summary>
		/// Public reply command, can be called by anyone, and only responds to caller with the new files.
		/// </summary>
		/// <returns></returns>
		public async Task RequestFiles(List<string> path)
		{
			// Possible race condition with the brodcast command? Low-impact bug if true.
			await Clients.Caller.SendAsync("RequestFilesResponse", GetFiles(path));
		}

		/// <summary>
		/// Private Brodcast command, can only be used by the Hub to announce that a new file was uploaded, deleted and so on.
		/// </summary>
		/// <returns></returns>
		private async Task UpdateFiles()
		{
			await Clients.All.SendAsync("FilesUpdated");
		}

		private List<NavigationItem> GetFiles(List<string> path)
		{
			List<NavigationItem> navigationItems = new List<NavigationItem>();
			navigationItems.Add(new NavigationItem(NavigationItemType.FOLDER, "Music"));
			navigationItems.Add(new NavigationItem(NavigationItemType.FOLDER, "Movies"));
			navigationItems.Add(new NavigationItem(NavigationItemType.FILE, "dog_picture.png", "123"));
			navigationItems.Add(new NavigationItem(NavigationItemType.FILE, "cat_picture.jpeg", "124"));

			if (path.Count != 0)
				Debug.Print("Request: " + string.Join('/', path));
			else
				Debug.Print("Files request for root");

			return navigationItems;
		}
	}

    public class NavigationItem
	{
        public string ItemType { get; private set; }
        public string Name { get; private set; }
        public string? Id { get; private set; }

		public NavigationItem(NavigationItemType itemType, string name)
		{
			if (itemType == NavigationItemType.FOLDER)
				ItemType = "folder";
			else if (itemType == NavigationItemType.FILE)
				ItemType = "file";
			else
				ItemType = "unknown";


			Name = name;
		}

		public NavigationItem(NavigationItemType itemType, string name, string id) : this(itemType, name)
		{
			Id = id;
		}
	}

	public enum NavigationItemType
	{
		FOLDER,
		FILE
	}
}
