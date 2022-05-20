using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using WebFTPSharp.Models;
using WebFTPSharp.Services.FileProvider;

namespace WebFTPSharp.Hubs
{
	public class FileBrowserHub : Hub
    {
		private readonly IFileProvider _fileProvider;
		private readonly ILogger<FileBrowserHub> _logger;
		private readonly IHubContext<FileBrowserHub> _hubContext;

		public FileBrowserHub(ILogger<FileBrowserHub> logger, IFileProvider fileProvider, IHubContext<FileBrowserHub> hubContext)
		{
			this._fileProvider = fileProvider;
			this._logger = logger;
			this._hubContext = hubContext;

			fileProvider.FileUploaded += FileProvider_FileUploaded;
		}

		~FileBrowserHub()
		{
			_fileProvider.FileUploaded -= FileProvider_FileUploaded;
		}

		private async void FileProvider_FileUploaded(string fileHash)
		{
			await _hubContext.Clients.All.SendAsync("FilesUpdated");
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

		private List<NavigationItem> GetFiles(List<string> path)
		{
			if (path.Count != 0)
				_logger.LogInformation("Received request for files from path: " + string.Join('/', path));
			else
				_logger.LogInformation("Received request for files from path: [root]");

			return _fileProvider.GetNavigationItems(path);
		}
	}
}
