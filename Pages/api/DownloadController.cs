using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using WebFTPSharp.Services.FileProvider;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebFTPSharp.Pages.api
{
	[Route("api/download")]
	[ApiController]
	public class DownloadController : ControllerBase
	{
		private readonly ILogger<DownloadController> _logger;
		private readonly IFileProvider fileProvider;

		public DownloadController(ILogger<DownloadController> logger, IFileProvider fileProvider)
		{
			_logger = logger;
			this.fileProvider = fileProvider;
		}

		// POST api/download
		[HttpPost]
		public ActionResult Post([FromBody] DownloadRequestModel data)
		{
			_logger.LogInformation($"Someone is downloading file with id '${data.Id}'");

			if(data.Id != null)
			{
				// TODO: test performance for file stream on small files, and determine if read-to-memory > write to request is faster
				// than using a file stream.
				Stream? fileStream = fileProvider.GetFileStream(data.Id);
				if (fileStream != null)
				{
					return File(fileStream, "application/octet-stream");
				}
			}
			return BadRequest("You must provide a valid ID or the file no longer exists.");
		}

		public class DownloadRequestModel
		{
			[Required]
			public string? Id { get; set; }
		}
	}
}
