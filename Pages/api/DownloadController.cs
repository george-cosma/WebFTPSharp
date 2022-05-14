using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
		public async Task<IActionResult> Post([FromBody] DownloadRequestModel data)
		{
			_logger.LogInformation($"Someone is downloading file with id '${data.Id}'");

			if(data.Id != null)
			{
				byte[]? bytes = await fileProvider.GetFileAsync(data.Id);
				if (bytes != null)
				{
					// Headers must be set before writing to body.
					Response.Headers.ContentLength = bytes.Length;
					await Response.Body.WriteAsync(bytes, 0, bytes.Length);
					
					return new EmptyResult();
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
