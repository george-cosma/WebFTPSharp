using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;

namespace WebFTPSharp.Pages
{
	public class IndexModel : PageModel
	{
		private readonly ILogger<IndexModel> _logger;

		public IndexModel(ILogger<IndexModel> logger)
		{
			_logger = logger;
			logger.LogDebug("test");

			// GET IP
			try
			{
				using Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0);

				socket.Connect("8.8.8.8", 65530);
				IPEndPoint? endPoint = socket.LocalEndPoint as IPEndPoint;
				string? localIP = endPoint?.Address.ToString();
				if (localIP != null)
				{
					IP = localIP;
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Failed to get IP");
			}
		}

		public string IP { get; set; } = "127.0.0.1";
		public void OnGet()
		{

		}

	}
}
