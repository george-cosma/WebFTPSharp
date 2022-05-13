using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using WebFTPSharp.Models;
using WebFTPSharp.Services.FileProvider;

namespace WebFTPSharp.Hubs
{
	public class FileBrowserHub : Hub
    {
		private readonly IFileProvider fileProvider;

		public FileBrowserHub(IFileProvider fileProvider)
		{
			this.fileProvider = fileProvider;
		}

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
			fileProvider.UpdateFiles();
			await Clients.All.SendAsync("FilesUpdated");
		}

		private List<NavigationItem> GetFiles(List<string> path)
		{
			if (path.Count != 0)
				Debug.Print("Request: " + string.Join('/', path));
			else
				Debug.Print("Files request for root");

			return fileProvider.GetNavigationItems(path);
		}
	}
}
